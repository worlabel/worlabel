from pydantic import BaseModel
from typing import List, Optional
from schemas.predict_response import LabelData

class TrainDataInfo(BaseModel):
    image_url: str
    label: LabelData


class TrainRequest(BaseModel):
    project_id: int
    data: List[TrainDataInfo]
    seed: Optional[int] = None # 랜덤 변수 시드
    ratio: Optional[float] = 0.8 # 훈련/검증 분할 비율
