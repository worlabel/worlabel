from pydantic import BaseModel, Field
from typing import List, Optional, Union
from schemas.predict_response import LabelData
from schemas.predict_request import LabelCategory

class TrainDataInfo(BaseModel):
    image_url: str
    label: LabelData

class TrainRequest(BaseModel):
    project_id: int
    data: List[TrainDataInfo]
    seed: Optional[int] = None # 랜덤 변수 시드
    ratio: float = 0.8 # 훈련/검증 분할 비율
    epochs: int = 50 # 훈련 반복 횟수
    batch: Union[float, int] = -1 # 훈련 batch 수[int] or GPU의 사용률 자동[float] default(-1): gpu의 60% 사용 유지
    path: Optional[str] = Field(None, alias="model_path")
    label_categories: Optional[List[LabelCategory]] = None # 새로운 레이블 카테고리 확인용
