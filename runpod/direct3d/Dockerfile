# Direct3D-S2 image-to-3D RunPod Serverless 워커 (지오메트리 전용)
#
# TRELLIS.2 가 게이트된 DINOv3 인코더 때문에 막혀 있는 동안, 핵심 질문에 먼저 답하려고 만들었다.
# 질문: "Meshy 가 6회 전부 구겼던 트럭 적재함 평면을, 희소 복셀 계열은 펴는가?"
# 그건 텍스처가 아니라 형상 문제라 지오메트리만으로 판정된다.
#
# Direct3D-S2 는 MIT 이고 인코더가 torch.hub 의 DINOv2 라 게이트가 없다.
# 가중치도 4.2GB — TRELLIS.2(15GB) 대비 콜드스타트가 훨씬 짧다.

FROM runpod/pytorch:2.4.0-py3.11-cuda12.4.1-devel-ubuntu22.04

WORKDIR /app

# libsparsehash-dev 가 핵심이다 — torchsparse 가 google sparsehash 헤더 없이는 컴파일이 안 된다.
RUN apt-get update && apt-get install -y \
        git build-essential ninja-build libsparsehash-dev \
        libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 빌더에 GPU 가 없으므로 arch 를 명시한다. 안 하면 torch cpp_extension 이 장착 GPU 를 찾다 실패한다.
# 8.6=A40/A6000, 8.9=L40/L40S/4090. 엔드포인트 gpuTypeIds 와 반드시 같이 움직여야 한다.
ENV TORCH_CUDA_ARCH_LIST="8.6;8.9+PTX"
ENV CUDA_HOME=/usr/local/cuda
ENV MAX_JOBS=4

# Direct3D-S2 는 torch 2.5.1 기준. README 는 cu121 이지만 베이스 툴킷이 12.4 라 cu124 로 맞춘다
# (툴킷과 wheel 의 CUDA 가 어긋나면 torchsparse 컴파일에서 깨진다).
#
# torchaudio 를 같이 고정하는 이유: 베이스의 torchaudio 2.4.0 을 남겨두면 torch 만 올라가
# libtorchaudio.so 가 사라진 심볼을 참조해 런타임에 죽는다. TRELLIS 워커에서 실제로 당한 문제다.
RUN pip install --upgrade pip && \
    pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 \
        --index-url https://download.pytorch.org/whl/cu124

# requirements.txt 안의 flash-attn 은 빌드 격리 상태에서 torch 를 못 찾아 소스 빌드로 새어나간다.
# 먼저 깔아두면 뒤에서 이미 충족된 것으로 넘어간다.
RUN pip install flash-attn==2.7.3 --no-build-isolation

RUN git clone https://github.com/mit-han-lab/torchsparse.git /tmp/torchsparse && \
    pip install /tmp/torchsparse --no-build-isolation && \
    rm -rf /tmp/torchsparse

RUN git clone https://github.com/DreamTechAI/Direct3D-S2.git /app/Direct3D-S2

WORKDIR /app/Direct3D-S2
# requirements.txt 가 third_party/voxelize/ 를 상대경로로 참조한다 — 반드시 레포 루트에서 실행해야 한다.
#
# --no-build-isolation 이 필수다. voxelize 는 setup.py 에서 torch 를 import 하는데,
# 격리된 빌드 환경에는 torch 가 없어 "ModuleNotFoundError: No module named 'torch'" 로 죽는다.
# 격리를 끄면 위에서 깐 torch 2.5.1 을 그대로 본다.
RUN pip install -r requirements.txt --no-build-isolation && \
    pip install -e . --no-build-isolation

WORKDIR /app

RUN pip install runpod boto3 requests hf_transfer

COPY handler.py /app/handler.py

# RunPod Cached Models 마운트 규격. 어긋나면 콜드스타트마다 가중치를 다시 받는다.
ENV HF_HOME=/runpod-volume/huggingface-cache
ENV HUGGINGFACE_HUB_CACHE=/runpod-volume/huggingface-cache
ENV HF_HUB_ENABLE_HF_TRANSFER=1
# torch.hub 로 받는 DINOv2 도 같은 곳에 모은다.
ENV TORCH_HOME=/runpod-volume/torch-hub
RUN mkdir -p /app/hf_cache /app/torch_hub

CMD ["python", "-u", "/app/handler.py"]
