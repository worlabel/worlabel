from pydantic import BaseModel, Field
from typing import List, Optional, Union, Literal
from schemas.predict_response import LabelData

class TrainDataInfo(BaseModel):
    image_url: str
    data_url: str

class TrainRequest(BaseModel):
    project_id: int
    m_key: str = Field("yolo8", alias="model_key")
    m_id: int = Field(..., alias="model_id") # 학습 중 에포크 결과를 보낼때 model_id를 보냄
    label_map: dict[int, int] = Field({}, description="모델 레이블 카테고리 idx: 프로젝트 레이블 카테고리 idx , None 일경우 레이블 데이터(프로젝트 레이블)의 idx로 학습")
    data: List[TrainDataInfo]
    ratio: float = 0.8 # 훈련/검증 분할 비율

    # 학습 파라미터
    epochs: int = 50 # 훈련 반복 횟수
    batch: Union[float, int] = -1 # 훈련 batch 수[int] or GPU의 사용률 자동[float] default(-1): gpu의 60% 사용 유지
    lr0: float = 0.01 # 초기 학습 가중치
    lrf: float = 0.01 # lr0 기준으로 학습 가중치의 최종 수렴치 (ex lr0의 0.01배)
    optimizer: Literal['auto', 'SGD', 'Adam', 'AdamW', 'NAdam', 'RAdam', 'RMSProp'] = 'auto'
