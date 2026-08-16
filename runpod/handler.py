"""
TRELLIS.2 image-to-3D RunPod Serverless 핸들러

목적: 이미지 한 장 → PBR 텍스처가 붙은 GLB → S3 업로드 → URL 반환.
      Meshy(scripts/assets/meshy.mjs)와 같은 자리에 꽂아 쓰기 위한 워커다.

배치를 기본으로 설계한 이유:
    RunPod 은 워커 기동부터 완전 정지까지 과금한다 — 컨테이너 초기화, 4B 모델 로딩,
    작업 후 idle timeout 까지 전부. 소품 20개를 20번 호출하면 콜드스타트를 20번 낸다.
    그래서 items[] 로 한 잡에 여러 장을 넘길 수 있게 했다. 모델은 한 번만 올라간다.

환경변수:
    AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY   S3 업로드용
    AWS_S3_BUCKET                                기본 버킷 (input 으로 덮어쓰기 가능)
    AWS_REGION                                   기본 ap-northeast-2
    TRELLIS2_MODEL                               기본 microsoft/TRELLIS.2-4B
    HF_TOKEN                                     (선택) HF rate limit 회피

요청 예시 — 단건:
{
  "input": {
    "image_b64": "iVBORw0...",
    "name": "boxtruck",
    "seed": 42,
    "decimation_target": 50000,
    "texture_size": 2048,
    "s3_folder": "kse/models"
  }
}

요청 예시 — 배치:
{
  "input": {
    "items": [
      {"image_url": "https://.../e00.png", "name": "boxtruck"},
      {"image_url": "https://.../f01.png", "name": "reachstacker"}
    ],
    "decimation_target": 50000
  }
}

응답 예시:
{
  "results": [
    {"name": "boxtruck", "glb_url": "https://...s3...glb", "mb": 8.4, "seconds": 74.2}
  ],
  "load_seconds": 41.3,
  "gpu": "NVIDIA A40"
}
"""

import base64
import inspect
import io
import os
import sys
import time
import traceback
import uuid
from datetime import datetime

# TRELLIS.2 는 pip 패키지로 설치되지 않는다 — setup.sh 는 의존성만 깔고
# trellis2 패키지 자체는 클론한 레포 안에 그대로 있다. 경로를 직접 얹어야 import 된다.
sys.path.insert(0, "/app/TRELLIS.2")

# 백엔드 지정은 import 전에 해야 먹는다. flash-attn 을 setup.sh 로 깔았으므로 기본은 flash_attn.
os.environ.setdefault("ATTN_BACKEND", "flash_attn")
os.environ.setdefault("SPCONV_ALGO", "native")

import runpod  # noqa: E402

_BOOT_T0 = time.time()
_MODEL_ID = os.environ.get("TRELLIS2_MODEL", "microsoft/TRELLIS.2-4B")

# 파이프라인은 전역에 한 번만 올린다. 웜 워커는 이 비용을 건너뛴다.
_PIPE = None
_LOAD_SECONDS = 0.0


def _log(msg: str) -> None:
    print(f"[{time.time() - _BOOT_T0:7.2f}s] {msg}", flush=True)


def _gpu_name() -> str:
    try:
        import torch

        return torch.cuda.get_device_name(0)
    except Exception:
        return "unknown"


def _load_pipeline():
    """4B 모델 로딩. 콜드스타트의 대부분이 여기다."""
    global _PIPE, _LOAD_SECONDS
    if _PIPE is not None:
        return _PIPE

    t0 = time.time()
    _log(f"파이프라인 로딩 시작 — {_MODEL_ID} on {_gpu_name()}")
    from trellis2.pipelines import Trellis2ImageTo3DPipeline

    pipe = Trellis2ImageTo3DPipeline.from_pretrained(_MODEL_ID)
    pipe.cuda()
    _PIPE = pipe
    _LOAD_SECONDS = time.time() - t0
    _log(f"파이프라인 준비 완료 ({_LOAD_SECONDS:.1f}s)")
    return _PIPE


def _call_filtered(fn, *args, **kwargs):
    """
    시그니처에 실제로 있는 키워드만 골라 넘긴다.

    TRELLIS.2 는 아직 릴리스 초기라 run()/to_glb() 의 인자 이름이 버전 사이에 바뀐다.
    모르는 키를 그대로 넘기면 TypeError 로 잡 전체가 죽는데, 그 손실이 훨씬 크다.
    """
    try:
        allowed = set(inspect.signature(fn).parameters)
    except (TypeError, ValueError):
        return fn(*args, **kwargs)
    dropped = [k for k in kwargs if k not in allowed]
    if dropped:
        _log(f"  (미지원 인자 무시: {', '.join(dropped)})")
    return fn(*args, **{k: v for k, v in kwargs.items() if k in allowed})


def _load_image(item: dict):
    """image_b64 또는 image_url 중 하나. 알파가 있으면 살린다 — 실루엣 판정에 쓰인다."""
    from PIL import Image

    if item.get("image_b64"):
        raw = item["image_b64"]
        # data URI 로 넘어오는 경우도 받아준다.
        if "," in raw[:64] and raw.strip().startswith("data:"):
            raw = raw.split(",", 1)[1]
        data = base64.b64decode(raw)
    elif item.get("image_url"):
        import requests

        response = requests.get(item["image_url"], timeout=120)
        response.raise_for_status()
        data = response.content
    else:
        raise ValueError("image_b64 또는 image_url 이 필요하다")

    image = Image.open(io.BytesIO(data))
    return image.convert("RGBA") if image.mode in ("RGBA", "LA", "P") else image.convert("RGB")


def _upload(path: str, bucket: str, key: str, region: str) -> str:
    import boto3

    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
        region_name=region,
    )
    s3.upload_file(path, bucket, key, ExtraArgs={"ContentType": "model/gltf-binary"})
    return f"https://{bucket}.s3.{region}.amazonaws.com/{key}"


def _generate(pipe, item: dict, opts: dict, bucket: str, region: str) -> dict:
    import o_voxel

    name = item.get("name") or f"model-{uuid.uuid4().hex[:8]}"
    t0 = time.time()
    _log(f"[{name}] 생성 시작")

    image = _load_image(item)
    outputs = _call_filtered(
        pipe.run,
        image,
        seed=item.get("seed", opts.get("seed", 42)),
        resolution=opts.get("resolution", 1024),
    )
    mesh = outputs[0] if isinstance(outputs, (list, tuple)) else outputs

    # simplify 는 GLB 데시메이션이 아니라 복셀 단계의 상한이다. 웹용 폴리 절감은 아래 to_glb 쪽.
    mesh.simplify(opts.get("simplify", 16777216))

    glb = _call_filtered(
        o_voxel.postprocess.to_glb,
        vertices=mesh.vertices,
        faces=mesh.faces,
        attr_volume=mesh.attrs,
        coords=mesh.coords,
        attr_layout=mesh.layout,
        voxel_size=mesh.voxel_size,
        aabb=[[-0.5, -0.5, -0.5], [0.5, 0.5, 0.5]],
        # 웹 실시간 렌더 기준. Meshy 는 target_polycount 50000 으로 맞춰 썼다 —
        # 3만에서는 패널이 휘고 후미가 뭉개졌다는 실측이 있어 같은 값에서 출발한다.
        decimation_target=opts.get("decimation_target", 50000),
        # 4096 은 웹에 과하다. 2048 이면 소품 기준 눈에 띄는 손실 없이 파일이 크게 준다.
        texture_size=opts.get("texture_size", 2048),
        remesh=opts.get("remesh", True),
    )

    local = f"/tmp/{name}-{uuid.uuid4().hex[:6]}.glb"
    # webp 텍스처는 GLB 를 크게 줄인다. three.js 는 EXT_texture_webp 를 지원하지만
    # Blender 등 파이프라인 도구로 열 일이 있으면 extension_webp=false 로 뽑을 것.
    _call_filtered(glb.export, local, extension_webp=opts.get("webp", True))

    size = os.path.getsize(local)
    folder = opts.get("s3_folder", "kse/models")
    key = f"{folder}/{datetime.utcnow():%Y-%m-%d}/{name}-{uuid.uuid4().hex[:6]}.glb"
    url = _upload(local, bucket, key, region)
    os.remove(local)

    seconds = time.time() - t0
    _log(f"[{name}] 완료 {size / 1024 / 1024:.2f} MB / {seconds:.1f}s → {key}")
    return {
        "name": name,
        "glb_url": url,
        "s3_key": key,
        "mb": round(size / 1024 / 1024, 2),
        "seconds": round(seconds, 1),
    }


def handler(job):
    payload = job.get("input") or {}

    bucket = payload.get("s3_bucket") or os.environ.get("AWS_S3_BUCKET")
    if not bucket:
        return {"error": "s3_bucket 또는 AWS_S3_BUCKET 환경변수가 필요하다"}
    region = payload.get("s3_region") or os.environ.get("AWS_REGION", "ap-northeast-2")

    items = payload.get("items")
    if not items:
        # 단건 요청도 배치 경로로 흘려보낸다 — 분기를 둘로 두면 한쪽만 고치게 된다.
        items = [payload]
    if not isinstance(items, list):
        return {"error": "items 는 배열이어야 한다"}

    opts = {
        k: payload[k]
        for k in (
            "seed", "resolution", "simplify", "decimation_target",
            "texture_size", "remesh", "webp", "s3_folder",
        )
        if k in payload
    }

    try:
        pipe = _load_pipeline()
    except Exception as error:
        traceback.print_exc()
        return {"error": f"파이프라인 로딩 실패: {error}"}

    results = []
    for item in items:
        try:
            results.append(_generate(pipe, item, opts, bucket, region))
        except Exception as error:
            traceback.print_exc()
            # 배치 중 한 장이 실패해도 나머지는 건진다 — 콜드스타트를 이미 지불했다.
            results.append({"name": item.get("name"), "error": str(error)})

    return {
        "results": results,
        "load_seconds": round(_LOAD_SECONDS, 1),
        "gpu": _gpu_name(),
    }


runpod.serverless.start({"handler": handler})
