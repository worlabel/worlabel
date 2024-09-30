from pydantic import BaseModel, Field
from typing import Literal

class TrainDataInfo(BaseModel):
    image_url: str
    data_url: str

class TrainRequest(BaseModel):
    project_id: int = Field(..., gt= 0)
    m_key: str = Field("yolo8", alias="model_key")
    m_id: int = Field(..., alias="model_id", gt= 0) # 학습 중 에포크 결과를 보낼때 model_id를 보냄
    label_map: dict[str, int] = Field(..., description="프로젝트 레이블 이름: 프로젝트 레이블 pk")
    data: list[TrainDataInfo]
    ratio: float = Field(0.8, gt=0, lt=1) # 훈련/검증 분할 비율

    # 학습 파라미터
    epochs: int = Field(50, gt= 0, lt = 1000) # 훈련 반복 횟수
    batch: int = Field(16, gt=0, le = 10000) # 훈련 batch 수[int] or GPU의 사용률 자동[float] default(-1): gpu의 60% 사용 유지
    lr0: float = Field(0.01, gt= 0, lt= 1) # 초기 학습 가중치
    lrf: float = Field(0.01, gt= 0, lt= 1) # lr0 기준으로 학습 가중치의 최종 수렴치 (ex lr0의 0.01배)
    optimizer: Literal['auto', 'SGD', 'Adam', 'AdamW', 'NAdam', 'RAdam', 'RMSProp'] = 'auto'
    
