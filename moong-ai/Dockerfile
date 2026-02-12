FROM python:3.11-slim-bullseye

WORKDIR /app

# 빌드 도구
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ && \
    rm -rf /var/lib/apt/lists/*

# 의존성 설치 (런타임에 직접)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 파일
COPY main.py .
COPY model.pkl .
COPY encoders.pkl .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
