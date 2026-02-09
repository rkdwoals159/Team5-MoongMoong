# 🎓 온라인 학습 API 가이드 (v3.0)

## 📋 새로운 기능

### ✅ 추가된 엔드포인트

1. **POST /train/single** - 단일 학습 데이터 추가
2. **POST /train/batch** - 배치 학습 데이터 추가
3. **GET /train/status** - 학습 버퍼 상태 조회
4. **POST /train/update-now** - 즉시 모델 업데이트
5. **DELETE /train/clear-buffer** - 학습 버퍼 초기화

---

## 🧠 작동 원리

### 1. 데이터 수집 단계
```
새 데이터 입력 → 유효성 검사 → 버퍼에 저장 → 로그 파일 저장
```

### 2. 점진적 학습 (Incremental Learning)
```
버퍼 크기 ≥ 10개 → 자동 모델 업데이트 (낮은 학습률)
또는
수동 트리거 → 즉시 모델 업데이트
```

### 3. 가중치 조정
- **기존 지식 보존**: XGBoost의 `xgb_model` 파라미터 사용
- **낮은 영향도**: 학습률 0.005-0.01 (기본 0.1에 비해 매우 낮음)
- **점진적 업데이트**: 소량의 데이터로 조금씩 업데이트

---

## 📡 API 사용법

### 1️⃣ 단일 데이터 추가

**요청:**
```bash
curl -X POST http://localhost:8000/train/single \
  -H "Content-Type: application/json" \
  -d '{
    "breed": "GOL",
    "age": 7.5,
    "sex": "M",
    "disease": "MUS"
  }'
```

**Python:**
```python
import requests

data = {
    "breed": "GOL",
    "age": 7.5,
    "sex": "M",
    "disease": "MUS"
}

response = requests.post(
    "http://localhost:8000/train/single",
    json=data
)
print(response.json())
```

**응답:**
```json
{
  "status": "success",
  "message": "Training data added successfully",
  "records_added": 1,
  "total_buffer_size": 5,
  "model_updated": false
}
```

---

### 2️⃣ 배치 데이터 추가

**요청:**
```bash
curl -X POST http://localhost:8000/train/batch \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"breed": "POO", "age": 3.0, "sex": "F", "disease": "DER"},
      {"breed": "MAL", "age": 5.5, "sex": "M", "disease": "GAS"},
      {"breed": "GOL", "age": 10.0, "sex": "F", "disease": "END"}
    ]
  }'
```

**Python:**
```python
batch = {
    "data": [
        {"breed": "POO", "age": 3.0, "sex": "F", "disease": "DER"},
        {"breed": "MAL", "age": 5.5, "sex": "M", "disease": "GAS"},
        {"breed": "GOL", "age": 10.0, "sex": "F", "disease": "END"}
    ]
}

response = requests.post(
    "http://localhost:8000/train/batch",
    json=batch
)
```

**응답:**
```json
{
  "status": "success",
  "message": "Batch training completed with 3 records",
  "records_added": 3,
  "total_buffer_size": 8,
  "model_updated": true
}
```

---

### 3️⃣ 학습 버퍼 상태 확인

**요청:**
```bash
curl http://localhost:8000/train/status
```

**응답:**
```json
{
  "total_records": 15,
  "breed_distribution": {
    "GOL": 5,
    "POO": 4,
    "MAL": 6
  },
  "disease_distribution": {
    "MUS": 3,
    "DER": 4,
    "GAS": 5,
    "END": 3
  },
  "sex_distribution": {
    "M": 8,
    "F": 7
  },
  "oldest_record": "2024-02-08T10:30:00",
  "newest_record": "2024-02-08T11:45:00"
}
```

---

### 4️⃣ 즉시 모델 업데이트

**요청:**
```bash
curl -X POST http://localhost:8000/train/update-now
```

**응답:**
```json
{
  "status": "success",
  "message": "Model updated with 15 buffered records",
  "records_used": 15,
  "model_updated": true
}
```

---

### 5️⃣ 버퍼 초기화

**요청:**
```bash
curl -X DELETE http://localhost:8000/train/clear-buffer
```

**응답:**
```json
{
  "status": "success",
  "message": "Cleared 15 records from training buffer"
}
```

---

## ⚙️ 설정 값

### 자동 업데이트 임계값
```python
MODEL_UPDATE_THRESHOLD = 10  # 10개 데이터마다 자동 업데이트
```

### 학습률
```python
# 단일/자동 업데이트
learning_rate = 0.01  # 기본값의 10%

# 배치 업데이트
learning_rate = 0.005  # 기본값의 5% (더 보수적)
```

이 값들은 `main_v3.py`에서 수정 가능합니다.

---

## 🔒 데이터 유효성 검사

입력 데이터는 다음 조건을 만족해야 합니다:

### ✅ 검사 항목

1. **breed** (견종)
   - 기존 모델에 학습된 견종 중 하나여야 함
   - 예: GOL, POO, MAL 등

2. **age** (나이)
   - 0 ≤ age ≤ 30
   - 소수점 가능 (예: 7.5)

3. **sex** (성별)
   - "M" 또는 "F"만 허용

4. **disease** (질병)
   - 기존 모델에 학습된 질병 중 하나여야 함
   - 예: MUS, DER, GAS 등

### ❌ 잘못된 입력 예시

```json
{
  "breed": "UNKNOWN",  // ❌ 존재하지 않는 견종
  "age": 50,           // ❌ 범위 초과
  "sex": "X",          // ❌ M 또는 F만 가능
  "disease": "ABC"     // ❌ 존재하지 않는 질병
}
```

**에러 응답:**
```json
{
  "detail": "Invalid breed 'UNKNOWN'. Must be one of ['GOL', 'POO', ...]"
}
```

---

## 💾 데이터 저장

### 학습 로그 파일
- **파일명**: `training_log.json`
- **위치**: 프로젝트 루트
- **형식**: JSON
- **용도**: 서버 재시작 시 학습 기록 복원

### 모델 백업
- **파일명**: `model_backup_YYYYMMDD_HHMMSS.pkl`
- **생성 시점**: 모델 업데이트 시마다
- **용도**: 문제 발생 시 롤백

**예시:**
```
model_backup_20240208_103045.pkl
model_backup_20240208_114522.pkl
```

---

## 🎯 사용 시나리오

### 시나리오 1: 실시간 데이터 수집
```python
# 사용자가 실제 진료 데이터를 입력할 때마다
def on_diagnosis_complete(breed, age, sex, disease):
    requests.post(
        "http://localhost:8000/train/single",
        json={
            "breed": breed,
            "age": age,
            "sex": sex,
            "disease": disease
        }
    )
```

### 시나리오 2: 정기 배치 업데이트
```python
# 매일 밤 12시에 수집된 데이터 일괄 학습
def nightly_batch_update(daily_records):
    requests.post(
        "http://localhost:8000/train/batch",
        json={"data": daily_records}
    )
```

### 시나리오 3: A/B 테스트
```python
# 업데이트 전후 예측 비교
before = get_prediction(breed, age, sex)
add_training_data(new_data)
after = get_prediction(breed, age, sex)
compare(before, after)
```

---

## ⚠️ 주의사항

### 1. 모델 드리프트 방지
- 너무 많은 데이터를 한 번에 학습하지 마세요
- 주기적으로 원본 데이터로 재학습 권장

### 2. 백업 관리
- 모델 백업 파일이 쌓이면 수동으로 정리
- 중요한 버전은 별도 보관

### 3. 데이터 품질
- 잘못된 라벨링 데이터는 모델 성능 저하
- 입력 전 데이터 검증 필수

### 4. 버퍼 관리
```python
# 주기적으로 버퍼 초기화 권장
# 또는 자동 초기화 로직 추가
if len(training_buffer) > 1000:
    clear_old_records()
```

---

## 📊 모니터링

### Health Check에서 확인
```bash
curl http://localhost:8000/health
```

**응답:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "available_breeds": 50,
  "available_sexes": 2,
  "available_diseases": 12,
  "total_combinations": 1200,
  "training_buffer_size": 15  // ← 버퍼 크기
}
```

### 학습 기록 모니터링
```python
import json

with open('training_log.json', 'r') as f:
    records = json.load(f)

print(f"총 학습 기록: {len(records)}개")
print(f"최근 기록: {records[-1]}")
```

---

## 🔄 롤백 방법

### 이전 모델로 되돌리기

```bash
# 백업 파일 확인
ls model_backup_*.pkl

# 원하는 백업으로 복원
cp model_backup_20240208_103045.pkl model.pkl

# 서버 재시작
python run.py
```

---

## 🧪 테스트

제공된 테스트 스크립트 실행:

```bash
python test_training_api.py
```

**테스트 항목:**
1. ✅ 단일 데이터 추가
2. ✅ 배치 데이터 추가
3. ✅ 유효성 검사
4. ✅ 자동 모델 업데이트
5. ✅ 수동 모델 업데이트
6. ✅ 버퍼 상태 조회
7. ✅ 예측 결과 확인

---

## 📈 성능 영향

### 예상 처리 시간
- **단일 데이터 추가**: <10ms
- **배치 10개 추가**: <50ms
- **모델 업데이트**: 100-500ms (데이터 크기 따라)

### 메모리 사용
- **버퍼**: ~1KB per record
- **백업 모델**: ~1-5MB per file

---

## 🎓 베스트 프랙티스

1. **소량 데이터 자주 추가** > 대량 데이터 한 번 추가
2. **정기적인 원본 재학습** (주 1회 또는 월 1회)
3. **중요 버전 백업 보관**
4. **데이터 품질 검증 강화**
5. **모니터링 대시보드 구축**

---

**온라인 학습 기능이 추가되었습니다!** 🎉

이제 모델이 실시간으로 새로운 데이터를 학습할 수 있습니다.