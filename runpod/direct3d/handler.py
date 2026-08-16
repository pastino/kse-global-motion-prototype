"""
Direct3D-S2 image-to-3D RunPod Serverless 핸들러 (지오메트리 전용)

목적: 이미지 한 장 → 메시 → GLB → S3.
      TRELLIS.2 가 게이트된 DINOv3 때문에 막힌 동안, "대형 평면이 구겨지는가"라는
      핵심 질문에 먼저 답하기 위한 워커다. 텍스처는 안 나온다 — 필요 없다.

TRELLIS 워커(runpod/handler.py)와 입출력 규약을 일부러 똑같이 맞췄다.
클라이언트(scripts/assets/trellis.mjs)를 엔드포인트만 바꿔 그대로 쓸 수 있어야
비교 조건이 흔들리지 않는다.

환경변수:
    AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_S3_BUCKET / AWS_REGION
    D3DS2_MODEL      기본 wushuang98/Direct3D-S2
    D3DS2_SUBFOLDER  기본 direct3d-s2-v-1-1
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


def _resolve_cache(env_key: str, preferred_default: str, fallback: str) -> str:
    """
    캐시 경로가 실제로 쓸 수 있는지 확인하고, 안 되면 컨테이너 디스크로 내린다.

    /runpod-volume 은 네트워크 볼륨이나 Cached Models 가 붙었을 때만 존재한다.
    안 붙은 엔드포인트에서 그대로 두면 첫 다운로드에서 죽는다.
    """
    preferred = os.environ.get(env_key, preferred_default)
    try:
        os.makedirs(preferred, exist_ok=True)
        probe = os.path.join(preferred, ".write-test")
        with open(probe, "w") as handle:
            handle.write("ok")
        os.remove(probe)
        return preferred
    except Exception:
        os.makedirs(fallback, exist_ok=True)
        print(f"[warn] {preferred} 사용 불가 → {fallback}", flush=True)
        return fallback


_HF = _resolve_cache("HF_HOME", "/runpod-volume/huggingface-cache", "/app/hf_cache")
os.environ["HF_HOME"] = _HF
os.environ["HUGGINGFACE_HUB_CACHE"] = _HF
os.environ["TORCH_HOME"] = _resolve_cache("TORCH_HOME", "/runpod-volume/torch-hub", "/app/torch_hub")

import runpod  # noqa: E402

_BOOT_T0 = time.time()
_MODEL = os.environ.get("D3DS2_MODEL", "wushuang98/Direct3D-S2")
_SUBFOLDER = os.environ.get("D3DS2_SUBFOLDER", "direct3d-s2-v-1-1")

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
    global _PIPE, _LOAD_SECONDS
    if _PIPE is not None:
        return _PIPE
    t0 = time.time()
    _log(f"파이프라인 로딩 — {_MODEL}/{_SUBFOLDER} on {_gpu_name()}")
    from direct3d_s2.pipeline import Direct3DS2Pipeline

    pipe = Direct3DS2Pipeline.from_pretrained(_MODEL, subfolder=_SUBFOLDER)
    pipe.to("cuda:0")
    _PIPE = pipe
    _LOAD_SECONDS = time.time() - t0
    _log(f"준비 완료 ({_LOAD_SECONDS:.1f}s)")
    return _PIPE


def _call_filtered(fn, *args, **kwargs):
    """시그니처에 있는 키워드만 넘긴다 — 인자명이 바뀌어도 잡 전체가 죽지 않게."""
    try:
        allowed = set(inspect.signature(fn).parameters)
    except (TypeError, ValueError):
        return fn(*args, **kwargs)
    dropped = [k for k in kwargs if k not in allowed]
    if dropped:
        _log(f"  (미지원 인자 무시: {', '.join(dropped)})")
    return fn(*args, **{k: v for k, v in kwargs.items() if k in allowed})


def _save_input_image(item: dict) -> str:
    """파이프라인이 파일 경로를 받으므로 디스크에 떨군다."""
    from PIL import Image

    if item.get("image_b64"):
        raw = item["image_b64"]
        if raw.strip().startswith("data:") and "," in raw[:64]:
            raw = raw.split(",", 1)[1]
        data = base64.b64decode(raw)
    elif item.get("image_url"):
        import requests

        response = requests.get(item["image_url"], timeout=120)
        response.raise_for_status()
        data = response.content
    else:
        raise ValueError("image_b64 또는 image_url 이 필요하다")

    path = f"/tmp/in-{uuid.uuid4().hex[:8]}.png"
    Image.open(io.BytesIO(data)).save(path)
    return path


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
    name = item.get("name") or f"model-{uuid.uuid4().hex[:8]}"
    t0 = time.time()
    _log(f"[{name}] 생성 시작")

    image_path = _save_input_image(item)
    result = _call_filtered(
        pipe.__call__,
        image_path,
        # 512 는 1024 의 중간 단계라 품질이 눈에 띄게 낮다고 저자들이 명시했다. 기본 1024.
        sdf_resolution=opts.get("sdf_resolution", 1024),
        remove_interior=opts.get("remove_interior", True),
        remesh=opts.get("remesh", False),
    )
    mesh = result["mesh"] if isinstance(result, dict) else result

    local = f"/tmp/{name}-{uuid.uuid4().hex[:6]}.glb"
    # 저자 예시는 .obj 지만 웹에서 쓸 것은 GLB 다. trimesh 가 확장자로 포맷을 고른다.
    mesh.export(local)

    size = os.path.getsize(local)
    faces = int(getattr(getattr(mesh, "faces", None), "shape", [0])[0] or 0)
    folder = opts.get("s3_folder", "kse/models")
    key = f"{folder}/{datetime.utcnow():%Y-%m-%d}/{name}-{uuid.uuid4().hex[:6]}.glb"
    url = _upload(local, bucket, key, region)
    os.remove(local)
    os.remove(image_path)

    seconds = time.time() - t0
    _log(f"[{name}] 완료 {size / 1024 / 1024:.2f} MB / {faces} faces / {seconds:.1f}s")
    return {
        "name": name,
        "glb_url": url,
        "s3_key": key,
        "mb": round(size / 1024 / 1024, 2),
        "faces": faces,
        "seconds": round(seconds, 1),
    }


def handler(job):
    payload = job.get("input") or {}

    bucket = payload.get("s3_bucket") or os.environ.get("AWS_S3_BUCKET")
    if not bucket:
        return {"error": "s3_bucket 또는 AWS_S3_BUCKET 환경변수가 필요하다"}
    region = payload.get("s3_region") or os.environ.get("AWS_REGION", "ap-northeast-2")

    items = payload.get("items") or [payload]
    if not isinstance(items, list):
        return {"error": "items 는 배열이어야 한다"}

    opts = {
        k: payload[k]
        for k in ("sdf_resolution", "remove_interior", "remesh", "s3_folder")
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
            results.append({"name": item.get("name"), "error": str(error)})

    return {"results": results, "load_seconds": round(_LOAD_SECONDS, 1), "gpu": _gpu_name()}


runpod.serverless.start({"handler": handler})
