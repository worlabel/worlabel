from pydantic import BaseModel, Field
from typing import Optional, Union

class ImageInfo(BaseModel):
    image_id: int
    image_url: str


class PredictRequest(BaseModel):
    project_id: int
    m_key: str = Field("yolo8", alias="model_key")  # model_ 로 시작하는 변수를 BaseModel의 변수로 만들경우 Warning 떠서 m_key로 대체
    label_map: dict[str, int] = Field(..., description="프로젝트 레이블 이름: 프로젝트 레이블 pk , None일 경우 모델 레이블 카테고리 idx로 레이블링")
    image_list: list[ImageInfo]  # 이미지 리스트
    conf_threshold: float = 0.25 # 
    iou_threshold: float = 0.45
