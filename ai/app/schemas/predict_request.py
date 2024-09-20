from pydantic import BaseModel, Field
from typing import List, Optional

class ImageInfo(BaseModel):
    image_id: int
    image_url: str

class LabelCategory(BaseModel):
    label_id: int
    label_name: str

class PredictRequest(BaseModel):
    project_id: int
    m_key: Optional[str] = Field(None, alias="model_key")
    image_list: List[ImageInfo]
    version: str = "latest"
    conf_threshold: float = 0.25
    iou_threshold: float = 0.45
    classes: Optional[List[int]] = None
    label_categories: Optional[List[LabelCategory]] = None
