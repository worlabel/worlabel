from pydantic import BaseModel, Field
from typing import Optional, Union

class ImageInfo(BaseModel):
    image_id: int
    image_url: str


class PredictRequest(BaseModel):
    project_id: int
    m_key: str = Field("yolo8", alias="model_key")
    label_map: dict[int, int] = Field(None, description="모델 레이블 카테고리 idx: 프로젝트 레이블 카테고리 idx , None 일경우 모델 레이블 카테고리 idx로 레이블링")
    image_list: list[ImageInfo]
    conf_threshold: float = 0.25
    iou_threshold: float = 0.45
