# TRELLIS.2 image-to-3D RunPod Serverless 워커
#
# Meshy 대체 후보. Meshy 가 대형 평면(트럭 적재함)에서 6회 전부 구김을 냈기 때문에,
# field-free 희소 복셀(O-Voxel) 표현을 쓰는 TRELLIS.2 로 같은 입력을 붙여본다.
#
# 가중치(약 15GB)는 이미지에 굽지 않는다 — GitHub Actions 러너 디스크(~14GB 여유)에
# 안 들어간다. 대신 glitch 워커들과 같은 규격으로 /runpod-volume HF 캐시에 받는다.

FROM runpod/pytorch:2.4.0-py3.11-cuda12.4.1-devel-ubuntu22.04

WORKDIR /app

# devel 이미지여야 한다 — nvdiffrast/CuMesh/FlexGEMM 를 nvcc 로 직접 컴파일한다.
RUN apt-get update && apt-get install -y \
        git build-essential ninja-build \
        libjpeg-dev libgl1 libglib2.0-0 libegl1 \
    && rm -rf /var/lib/apt/lists/*

# ── 빌드 타임에 GPU 가 없다는 사실이 이 이미지의 최대 함정 ──────────────────
# setup.sh 는 TORCH_CUDA_ARCH_LIST 를 안 잡아준다. 그러면 torch 의 cpp_extension 이
# "현재 장착된 GPU"를 보고 arch 를 정하려다 빌더에 GPU 가 없어 실패하거나,
# 전 아키텍처를 다 굽느라 빌드가 몇 시간으로 늘어난다. 반드시 명시한다.
#   8.6 = A40 / A6000 (AMPERE_48)
#   8.9 = L40S / RTX 4090 (ADA_48_PRO / ADA_24)
# H100(9.0) 이나 A100(8.0) 을 엔드포인트 gpuIds 에 추가하면 여기도 같이 늘려야 한다.
ENV TORCH_CUDA_ARCH_LIST="8.6;8.9+PTX"
ENV CUDA_HOME=/usr/local/cuda
# nvcc 병렬 잡을 안 묶으면 러너 메모리가 터진다.
ENV MAX_JOBS=4

# TRELLIS.2 는 torch 2.6.0 + cu124 기준이다. 베이스의 2.4.0 을 올린다.
#
# torchaudio 를 반드시 같이 올려야 한다. 베이스에 깔린 torchaudio 2.4.0 은 torch 2.4.0 의
# C++ 심볼에 링크돼 있어서, torch 만 2.6.0 으로 올리면 로딩 시점에 터진다:
#   libtorchaudio.so: undefined symbol: _ZN2at4_ops9fft_irfft4call...
# 세 패키지는 버전이 짝을 이룬다 — torch 2.6.0 ↔ torchvision 0.21.0 ↔ torchaudio 2.6.0.
RUN pip install --upgrade pip && \
    pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 \
        --index-url https://download.pytorch.org/whl/cu124

# 서브모듈까지 받아야 한다 — o-voxel 이 서브모듈이라 --recursive 없으면 --o-voxel 이 빈 디렉토리를 깐다.
RUN git clone -b main https://github.com/microsoft/TRELLIS.2.git --recursive /app/TRELLIS.2

WORKDIR /app/TRELLIS.2

# setup.sh 는 `command -v nvidia-smi` 하나로 cuda / hip 를 가른다. 그런데 nvidia-smi 는
# 드라이버가 런타임에 마운트해 주는 것이라 CUDA devel 이미지에는 없다 — 빌더에 GPU 가 없으니
# "Error: No supported GPU found" 로 0.04초 만에 죽는다. 존재 여부만 보므로 빈 스텁이면 통과한다.
#
# 스텁은 반드시 같은 RUN 안에서 지운다. /usr/local/bin 이 /usr/bin 보다 PATH 앞이라,
# 남겨두면 런타임에 진짜 nvidia-smi 를 가려버린다.
#
# --new-env 도 빼야 한다. 붙이면 conda 환경 trellis2 를 새로 만들어서
# 정작 CMD 가 실행되는 시스템 python 에는 아무것도 안 깔린다.
RUN printf '#!/bin/sh\nexit 0\n' > /usr/local/bin/nvidia-smi && chmod +x /usr/local/bin/nvidia-smi && \
    bash -c ". ./setup.sh --basic --flash-attn --nvdiffrast --nvdiffrec --cumesh --o-voxel --flexgemm" && \
    rm -f /usr/local/bin/nvidia-smi

WORKDIR /app

# RunPod SDK + S3 업로드 + HF 다운로드 가속
RUN pip install runpod boto3 requests hf_transfer

COPY handler.py /app/handler.py

# HuggingFace 캐시 경로 — RunPod Cached Models 마운트 규격(/runpod-volume/huggingface-cache)과
# 일치해야 한다. 경로가 다르면 호스트 캐시를 무시하고 매 콜드스타트마다 15GB 를 다시 받는다.
ENV HF_HOME=/runpod-volume/huggingface-cache
ENV HUGGINGFACE_HUB_CACHE=/runpod-volume/huggingface-cache
ENV HF_HUB_ENABLE_HF_TRANSFER=1

# 볼륨이 없을 때의 fallback
RUN mkdir -p /app/hf_cache

# 헤드리스 렌더 — nvdiffrast 가 EGL 을 쓴다. 이게 없으면 to_glb 의 텍스처 베이크에서 죽는다.
ENV PYOPENGL_PLATFORM=egl

CMD ["python", "-u", "/app/handler.py"]
