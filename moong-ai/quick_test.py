"""
온라인 학습 API 테스트 스크립트
"""

import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 70)
print("🧪 온라인 학습 API 테스트")
print("=" * 70)

# 1. Health Check
print("\n1️⃣ Health Check...")
response = requests.get(f"{BASE_URL}/health")
health = response.json()
print(f"✅ 서버 상태: {health['status']}")
print(f"   - 학습 버퍼 크기: {health['training_buffer_size']}")

# 2. 현재 학습 상태 확인
print("\n2️⃣ 학습 버퍼 상태 확인...")
response = requests.get(f"{BASE_URL}/train/status")
status = response.json()
print(f"   총 기록: {status['total_records']}")
if status['total_records'] > 0:
    print(f"   견종 분포: {status['breed_distribution']}")
    print(f"   질병 분포: {status['disease_distribution']}")
    print(f"   성별 분포: {status['sex_distribution']}")

# 3. 단일 데이터 추가 테스트
print("\n3️⃣ 단일 학습 데이터 추가...")
single_data = {
    "breed": "GOL",
    "age": 7.5,
    "sex": "M",
    "disease": "MUS"
}
print(f"   데이터: {single_data}")

response = requests.post(f"{BASE_URL}/train/single", json=single_data)
result = response.json()

if response.status_code == 200:
    print(f"✅ {result['message']}")
    print(f"   - 추가된 레코드: {result['records_added']}")
    print(f"   - 총 버퍼 크기: {result['total_buffer_size']}")
    print(f"   - 모델 업데이트 여부: {result['model_updated']}")
else:
    print(f"❌ 에러: {response.status_code}")
    print(f"   {result}")

# 4. 배치 데이터 추가 테스트
print("\n4️⃣ 배치 학습 데이터 추가...")
batch_data = {
    "data": [
        {"breed": "POO", "age": 3.0, "sex": "F", "disease": "DER"},
        {"breed": "MAL", "age": 5.5, "sex": "M", "disease": "GAS"},
        {"breed": "GOL", "age": 10.0, "sex": "F", "disease": "END"},
        {"breed": "POO", "age": 2.0, "sex": "M", "disease": "CAR"},
        {"breed": "MAL", "age": 8.0, "sex": "F", "disease": "MUS"}
    ]
}
print(f"   {len(batch_data['data'])}개 데이터 추가 중...")

response = requests.post(f"{BASE_URL}/train/batch", json=batch_data)
result = response.json()

if response.status_code == 200:
    print(f"✅ {result['message']}")
    print(f"   - 추가된 레코드: {result['records_added']}")
    print(f"   - 총 버퍼 크기: {result['total_buffer_size']}")
    print(f"   - 모델 업데이트 여부: {result['model_updated']}")
else:
    print(f"❌ 에러: {response.status_code}")
    print(f"   {result}")

# 5. 업데이트 후 상태 확인
print("\n5️⃣ 업데이트 후 학습 버퍼 상태...")
response = requests.get(f"{BASE_URL}/train/status")
status = response.json()
print(f"   총 기록: {status['total_records']}")
print(f"   견종 분포: {status['breed_distribution']}")
print(f"   질병 분포: {status['disease_distribution']}")

# 6. 잘못된 데이터 테스트
print("\n6️⃣ 잘못된 데이터 검증 테스트...")
invalid_data = {
    "breed": "INVALID_BREED",
    "age": 7.0,
    "sex": "M",
    "disease": "MUS"
}
print(f"   잘못된 견종으로 테스트: {invalid_data['breed']}")

response = requests.post(f"{BASE_URL}/train/single", json=invalid_data)
if response.status_code == 400:
    print(f"✅ 유효성 검사 통과 (잘못된 데이터 거부)")
    print(f"   에러 메시지: {response.json()['detail']}")
else:
    print(f"❌ 유효성 검사 실패")

# 7. 예측 테스트 (모델이 업데이트되었는지 확인)
print("\n7️⃣ 예측 테스트 (업데이트된 모델)...")
print("   특정 조합 예측 확인 중...")

response = requests.get(f"{BASE_URL}/predict")
if response.status_code == 200:
    data = response.json()

    # GOL, M, MUS 조합 찾기
    target = [p for p in data['predictions']
              if p['breed'] == 'GOL'
              and p['sex'] == 'M'
              and p['disease'] == 'MUS']

    if target:
        t = target[0]
        print(f"✅ GOL 품종, M 성별, MUS 질병 예측:")
        print(f"   - 7세: {t['diseasePercent'][7]}%")
        print(f"   - 10세: {t['diseasePercent'][10]}%")
else:
    print(f"❌ 예측 실패: {response.status_code}")

# 8. 수동 모델 업데이트 테스트
print("\n8️⃣ 수동 모델 업데이트 테스트...")
print("   현재 버퍼의 모든 데이터로 모델 업데이트...")

response = requests.post(f"{BASE_URL}/train/update-now")
if response.status_code == 200:
    result = response.json()
    print(f"✅ {result['message']}")
    print(f"   사용된 레코드: {result['records_used']}")
else:
    print(f"   (버퍼가 비어있을 수 있음)")

# 9. 최종 상태
print("\n9️⃣ 최종 Health Check...")
response = requests.get(f"{BASE_URL}/health")
health = response.json()
print(f"   학습 버퍼 크기: {health['training_buffer_size']}")

print("\n" + "=" * 70)
print("✅ 온라인 학습 API 테스트 완료!")
print("=" * 70)

print("\n💡 추가 기능:")
print("   - 버퍼 초기화: DELETE /train/clear-buffer")
print("   - 학습 상태: GET /train/status")
print("   - 즉시 업데이트: POST /train/update-now")
print(f"\n📚 API 문서: {BASE_URL}/docs")

# 10. 버퍼 초기화 여부 확인
print("\n🗑️  학습 버퍼를 초기화하시겠습니까? (y/N): ", end="")
clear = input().lower()
if clear == 'y':
    response = requests.delete(f"{BASE_URL}/train/clear-buffer")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ {result['message']}")
    else:
        print(f"❌ 초기화 실패")