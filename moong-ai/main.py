from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
import uvicorn
from typing import List, Optional
from datetime import datetime
import json
import os

app = FastAPI(
    title="Pet Disease Prediction API",
    description="XGBoost 기반 반려동물 질병 예측 API (온라인 학습 지원)",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 전역 변수
model = None
le_sex = None
le_breed = None
le_y = None
all_breeds = None
all_sexes = None

# 온라인 학습용 데이터 버퍼
training_buffer = []
TRAINING_LOG_FILE = "training_log.json"

# 서비스에서 지원하는 모든 견종 (Java Enum과 동일)
SUPPORTED_BREEDS = [
    "GRE", "DAL", "DAS", "DOB", "GOL", "LAB", "MAL", "BUL", "BEA", "BIC",
    "SHE", "SCH", "MIL", "MIS", "HUS", "HOU", "GER", "JIN", "CHS", "CHL",
    "COC", "TER", "POM", "POO", "SHI", "WEL", "ETC"
]


@app.on_event("startup")
async def load_model():
    """서버 시작 시 모델 로드"""
    global model, le_sex, le_breed, le_y, all_breeds, all_sexes

    try:
        with open('model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('encoders.pkl', 'rb') as f:
            encoders = pickle.load(f)
            le_sex = encoders['le_sex']
            le_breed = encoders['le_breed']
            le_y = encoders['le_y']
            all_breeds = encoders['all_breeds']
            all_sexes = le_sex.classes_.tolist()

        print("✅ Model and encoders loaded successfully")
        print(f"   - Model trained breeds: {len(all_breeds)}")
        print(f"   - Service supported breeds: {len(SUPPORTED_BREEDS)}")
        print(f"   - Missing breeds: {set(SUPPORTED_BREEDS) - set(all_breeds)}")
        print(f"   - Sexes: {all_sexes}")
        print(f"   - Diseases: {len(le_y.classes_)}")

        # 학습 로그 로드
        load_training_log()

    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise


def load_training_log():
    """학습 로그 파일 로드"""
    global training_buffer
    if os.path.exists(TRAINING_LOG_FILE):
        with open(TRAINING_LOG_FILE, 'r', encoding='utf-8') as f:
            training_buffer = json.load(f)
        print(f"   - Loaded {len(training_buffer)} training records from log")


def save_training_log():
    """학습 로그 파일 저장"""
    with open(TRAINING_LOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(training_buffer, f, ensure_ascii=False, indent=2)


class TrainingDataInput(BaseModel):
    breed: str
    age: float
    sex: str  # 'M' or 'F'
    disease: str

    class Config:
        json_schema_extra = {
            "example": {
                "breed": "GOL",
                "age": 7.5,
                "sex": "M",
                "disease": "MUS"
            }
        }


class TrainingDataBatchInput(BaseModel):
    data: List[TrainingDataInput]

    class Config:
        json_schema_extra = {
            "example": {
                "data": [
                    {
                        "breed": "GOL",
                        "age": 7.5,
                        "sex": "M",
                        "disease": "MUS"
                    },
                    {
                        "breed": "POO",
                        "age": 3.0,
                        "sex": "F",
                        "disease": "DER"
                    }
                ]
            }
        }


class TrainingResponse(BaseModel):
    status: str
    message: str
    records_added: int
    total_buffer_size: int
    model_updated: bool


class DiseasePercentItem(BaseModel):
    disease: str
    breed: str
    sex: str
    diseasePercent: List[float]


class PredictionResponse(BaseModel):
    predictions: List[DiseasePercentItem]


def validate_training_data(data: TrainingDataInput) -> tuple[bool, Optional[str]]:
    """학습 데이터 유효성 검사"""

    # 성별 검사
    if data.sex not in all_sexes:
        return False, f"Invalid sex '{data.sex}'. Must be one of {all_sexes}"

    # 견종 검사 - 서비스 지원 견종으로 확대
    if data.breed not in SUPPORTED_BREEDS:
        return False, f"Invalid breed '{data.breed}'. Must be one of {SUPPORTED_BREEDS}"

    # 질병 검사
    if data.disease not in le_y.classes_:
        return False, f"Invalid disease '{data.disease}'. Must be one of {le_y.classes_.tolist()}"

    # 나이 검사
    if not (0 <= data.age <= 30):
        return False, f"Invalid age {data.age}. Must be between 0 and 30"

    return True, None


def incremental_train(new_data: List[TrainingDataInput], learning_rate: float = 0.01):
    """점진적 모델 학습 - 모델에 있는 견종만 학습"""
    global model

    rows = []
    y_new = []

    # 모델에 있는 견종만 필터링
    for record in new_data:
        if record.breed not in all_breeds:
            print(f"⚠️ Skipping training for unsupported breed: {record.breed}")
            continue

        rows.append({
            "age": record.age,
            "sex_enc": le_sex.transform([record.sex])[0],
            "breed_enc": le_breed.transform([record.breed])[0],
        })
        y_new.append(le_y.transform([record.disease])[0])

    if len(rows) == 0:
        print("⚠️ No valid training data after filtering")
        return

    X_new = pd.DataFrame(rows, columns=["age", "sex_enc", "breed_enc"])
    y_new = np.array(y_new)

    # 모든 클래스 보장
    all_classes = set(range(len(le_y.classes_)))
    present = set(y_new.tolist())
    missing = all_classes - present

    if missing:
        dummy_X = X_new.iloc[[0]].copy()
        dummy_X = pd.concat([dummy_X] * len(missing), ignore_index=True)
        dummy_y = np.array(list(missing))

        X_new = pd.concat([X_new, dummy_X], ignore_index=True)
        y_new = np.concatenate([y_new, dummy_y])

    model.set_params(learning_rate=learning_rate)

    model.fit(
        X_new,
        y_new,
        xgb_model=model.get_booster(),
        verbose=False
    )

    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)


def calculate_average_predictions_for_breed(sex: str, ages: List[int]) -> dict:
    """
    특정 성별에 대해 모든 학습된 견종의 평균 예측값 계산

    Args:
        sex: 성별 ('M' or 'F')
        ages: 예측할 나이 리스트 (예: [0, 1, 2, ..., 20])

    Returns:
        질병별 평균 확률을 담은 딕셔너리
    """
    sex_enc = le_sex.transform([sex])[0]

    # 모든 학습된 견종에 대해 예측
    all_predictions = []

    for breed in all_breeds:
        breed_enc = le_breed.transform([breed])[0]
        X_input = [[age, sex_enc, breed_enc] for age in ages]
        probas = model.predict_proba(X_input)
        all_predictions.append(probas)

    # 평균 계산 (모든 견종의 예측값 평균)
    avg_probas = np.mean(all_predictions, axis=0)

    # 질병별로 정리
    avg_by_disease = {}
    for disease_idx, disease_name in enumerate(le_y.classes_):
        disease_percents = [
            round(float(proba[disease_idx] * 100), 2)
            for proba in avg_probas
        ]
        avg_by_disease[disease_name] = disease_percents

    return avg_by_disease


def predict_all_combinations():
    """모든 견종, 성별, 질병 조합에 대해 0-20세까지 확률 예측"""
    ages = list(range(0, 21))
    predictions = []

    for sex in all_sexes:
        sex_enc = le_sex.transform([sex])[0]

        # 미지원 견종에 대한 평균값 미리 계산
        avg_predictions = calculate_average_predictions_for_breed(sex, ages)

        for breed in SUPPORTED_BREEDS:  # 서비스 지원 견종 전체 순회
            # 모델에 학습된 견종인 경우
            if breed in all_breeds:
                breed_enc = le_breed.transform([breed])[0]
                X_input = [[age, sex_enc, breed_enc] for age in ages]
                probas = model.predict_proba(X_input)

                for disease_idx, disease_name in enumerate(le_y.classes_):
                    disease_percents = [
                        round(float(proba[disease_idx] * 100), 2)
                        for proba in probas
                    ]

                    predictions.append({
                        "disease": disease_name,
                        "breed": breed,
                        "sex": sex,
                        "diseasePercent": disease_percents
                    })

            # 모델에 없는 견종인 경우 - 평균값 사용
            else:
                for disease_name in le_y.classes_:
                    predictions.append({
                        "disease": disease_name,
                        "breed": breed,
                        "sex": sex,
                        "diseasePercent": avg_predictions[disease_name]
                    })

    return predictions


@app.post("/train/single", response_model=TrainingResponse)
async def add_training_data_single(data: TrainingDataInput):
    """
    단일 학습 데이터 추가

    - **breed**: 견종 코드
    - **age**: 나이 (0-30)
    - **sex**: 성별 ('M' 또는 'F')
    - **disease**: 질병 코드
    """
    # 유효성 검사
    is_valid, error_msg = validate_training_data(data)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    # 버퍼에 추가
    record = {
        "breed": data.breed,
        "age": data.age,
        "sex": data.sex,
        "disease": data.disease,
        "timestamp": datetime.now().isoformat()
    }
    training_buffer.append(record)
    save_training_log()

    # 버퍼가 일정 크기 이상이면 모델 업데이트
    MODEL_UPDATE_THRESHOLD = 10  # 10개 데이터마다 업데이트
    model_updated = False

    if len(training_buffer) >= MODEL_UPDATE_THRESHOLD:
        # 마지막 N개 데이터로 학습
        recent_data = [
            TrainingDataInput(**{k: v for k, v in r.items() if k != 'timestamp'})
            for r in training_buffer[-MODEL_UPDATE_THRESHOLD:]
        ]
        incremental_train(recent_data, learning_rate=0.01)
        model_updated = True

    return {
        "status": "success",
        "message": "Training data added successfully",
        "records_added": 1,
        "total_buffer_size": len(training_buffer),
        "model_updated": model_updated
    }


@app.post("/train/batch", response_model=TrainingResponse)
async def add_training_data_batch(batch: TrainingDataBatchInput):
    """
    배치 학습 데이터 추가 (여러 개 한번에)

    - **data**: 학습 데이터 리스트
    """
    # 모든 데이터 유효성 검사
    for i, data in enumerate(batch.data):
        is_valid, error_msg = validate_training_data(data)
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid data at index {i}: {error_msg}"
            )

    # 버퍼에 추가
    for data in batch.data:
        record = {
            "breed": data.breed,
            "age": data.age,
            "sex": data.sex,
            "disease": data.disease,
            "timestamp": datetime.now().isoformat()
        }
        training_buffer.append(record)

    save_training_log()

    # 배치 데이터로 바로 모델 업데이트 (가중치 낮게)
    incremental_train(batch.data, learning_rate=0.005)

    return {
        "status": "success",
        "message": f"Batch training completed with {len(batch.data)} records",
        "records_added": len(batch.data),
        "total_buffer_size": len(training_buffer),
        "model_updated": True
    }


@app.post("/train/update-now")
async def force_model_update():
    """
    버퍼에 있는 모든 데이터로 즉시 모델 업데이트
    """
    if len(training_buffer) == 0:
        raise HTTPException(status_code=400, detail="No training data in buffer")

    # 모든 버퍼 데이터로 학습
    all_data = [
        TrainingDataInput(**{k: v for k, v in r.items() if k != 'timestamp'})
        for r in training_buffer
    ]
    incremental_train(all_data, learning_rate=0.01)

    return {
        "status": "success",
        "message": f"Model updated with {len(training_buffer)} buffered records",
        "records_used": len(training_buffer),
        "model_updated": True
    }


@app.get("/train/status")
async def get_training_status():
    """학습 버퍼 상태 조회"""

    # 견종별, 질병별 분포
    breed_dist = {}
    disease_dist = {}
    sex_dist = {"M": 0, "F": 0}

    for record in training_buffer:
        breed_dist[record['breed']] = breed_dist.get(record['breed'], 0) + 1
        disease_dist[record['disease']] = disease_dist.get(record['disease'], 0) + 1
        sex_dist[record['sex']] = sex_dist.get(record['sex'], 0) + 1

    return {
        "total_records": len(training_buffer),
        "breed_distribution": breed_dist,
        "disease_distribution": disease_dist,
        "sex_distribution": sex_dist,
        "oldest_record": training_buffer[0]['timestamp'] if training_buffer else None,
        "newest_record": training_buffer[-1]['timestamp'] if training_buffer else None
    }


@app.delete("/train/clear-buffer")
async def clear_training_buffer():
    """학습 버퍼 초기화"""
    global training_buffer
    count = len(training_buffer)
    training_buffer = []
    save_training_log()

    return {
        "status": "success",
        "message": f"Cleared {count} records from training buffer"
    }


@app.get("/predict", response_model=PredictionResponse)
async def predict():
    """
    모든 견종, 성별, 질병 조합에 대해 0-20세까지 확률 예측
    (모델에 없는 견종은 전체 견종 평균값 반환)
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    print("🔮 Predicting all combinations...")
    predictions = predict_all_combinations()
    print(f"✅ Generated {len(predictions)} predictions")
    print(f"   - Trained breeds: {len(all_breeds)}")
    print(f"   - Supported breeds: {len(SUPPORTED_BREEDS)}")
    print(f"   - Missing breeds (using average): {set(SUPPORTED_BREEDS) - set(all_breeds)}")

    return {"predictions": predictions}


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "trained_breeds": len(all_breeds) if all_breeds else 0,
        "supported_breeds": len(SUPPORTED_BREEDS),
        "missing_breeds": list(set(SUPPORTED_BREEDS) - set(all_breeds)) if all_breeds else [],
        "available_sexes": len(all_sexes) if all_sexes else 0,
        "available_diseases": len(le_y.classes_) if le_y else 0,
        "total_combinations": (
            len(SUPPORTED_BREEDS) * len(all_sexes) * len(le_y.classes_)
            if all_sexes and le_y else 0
        ),
        "training_buffer_size": len(training_buffer)
    }


@app.get("/info")
async def get_info():
    """모델 정보 조회"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    return {
        "diseases": le_y.classes_.tolist(),
        "trained_breeds": all_breeds,
        "supported_breeds": SUPPORTED_BREEDS,
        "missing_breeds": list(set(SUPPORTED_BREEDS) - set(all_breeds)),
        "sexes": all_sexes,
        "total_combinations": len(SUPPORTED_BREEDS) * len(all_sexes) * len(le_y.classes_)
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
