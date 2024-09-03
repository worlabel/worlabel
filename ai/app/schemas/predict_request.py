from pydantic import BaseModel
from typing import List, Optional

class ImageInfo(BaseModel):
    image_id: int
    image_url: str    

class PredictRequest(BaseModel):
    project_id: int
    image_list: List[ImageInfo]
    version: Optional[str] = "latest"
    conf_threshold: Optional[float] = 0.25
    iou_threshold: Optional[float] = 0.45
    classes: Optional[List[int]] = None
