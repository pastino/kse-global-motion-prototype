# TRELLIS.2 워커 (RunPod Serverless)

Meshy 대체 후보. 이미지 한 장 → PBR GLB → S3 업로드.
클라이언트는 [`scripts/assets/trellis.mjs`](../scripts/assets/trellis.mjs) — `meshy.mjs` 와 인터페이스가 같다.

## 왜 만들었나

Meshy 는 기계류(지게차·컨베이어·게이트)에서 좋았지만 **대형 평면(트럭 적재함)에서 6회 전부 구김**을 냈다.
TRELLIS.2 는 SDF 기반이 아니라 field-free 희소 복셀(O-Voxel)이라 평면·판재에서 다른 결과가 나올 여지가 있다.
그게 사실인지 재는 것이 1차 목적이다. **아직 검증되지 않았다.**

라이선스는 MIT — 상용 웹사이트에 쓸 수 있다.
(Hunyuan3D 계열은 벤치마크 상위권이지만 라이선스 Territory 에서 **대한민국이 명시적으로 제외**돼 후보에서 빠졌다.)

## 배포 순서

```bash
# 1. 이미지 빌드 — Mac 에서 하면 안 된다(aarch64 ≠ x86_64 CUDA). GitHub 러너가 굽는다.
git push                     # runpod/** 가 바뀌면 자동 트리거
gh run watch                 # 빌드 40~70분 예상 (nvcc 확장 컴파일)

# 2. ghcr 패키지를 public 으로 바꾼다 (RunPod 이 pull 해야 함)
#    https://github.com/users/pastino/packages/container/kse-global-motion-prototype%2Ftrellis2-worker/settings
#    private 로 두려면 RunPod 템플릿에 registry auth 를 등록할 것.

# 3. 엔드포인트 생성 (RunPod 콘솔 또는 GraphQL)
#    - 이미지: ghcr.io/pastino/kse-global-motion-prototype/trellis2-worker:latest
#    - GPU:   AMPERE_48, ADA_48_PRO, ADA_24   ← 48GB 우선, 24GB 는 폴백
#    - Container Disk: 40GB 이상
#    - Idle Timeout: 5s (glitch 워커들과 동일)
#    - Env: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_S3_BUCKET / AWS_REGION

# 4. 실행
node --env-file=.env scripts/assets/trellis.mjs scripts/assets/raw/orbit/e00.png boxtruck
```

## GPU 선택 근거

RunPod 서버리스 요금 기준 **A40/A6000(48GB, $1.22/hr)** 이 RTX 4090(24GB, $1.10/hr)보다
겨우 11% 비싼데 VRAM 이 2배다. TRELLIS.2 공식 최소 요구가 24GB라 4090 은 1536³ 에서 OOM 경계선이다.

`TORCH_CUDA_ARCH_LIST="8.6;8.9+PTX"` 로 컴파일했다 — 8.6=A40/A6000, 8.9=L40S/4090.
**H100(9.0)이나 A100(8.0)을 gpuIds 에 추가하려면 Dockerfile 의 이 값도 같이 늘려야 한다.**

## 비용

콜드스타트(4B 모델 로딩)가 자산당 단가를 지배한다. 그래서 핸들러는 `items[]` 배치를 받는다 —
소품 20개를 한 잡에 넣으면 콜드스타트를 한 번만 낸다. 20번 따로 호출하면 20번 낸다.

## 알려진 미검증 지점

- `pipeline.run()` / `to_glb()` 의 인자 이름은 TRELLIS.2 릴리스 초기라 바뀔 수 있다.
  핸들러의 `_call_filtered()` 가 시그니처에 없는 키를 걸러내지만, **인자가 무시되면 로그에 남는다**.
  첫 실행 후 RunPod 콘솔 로그에서 `(미지원 인자 무시: ...)` 줄을 반드시 확인할 것.
- 생성 시간(A40 기준 90~120초)은 H100 공식 벤치(1024³ 17초)에서 외삽한 추정치다. 실측으로 갱신할 것.
