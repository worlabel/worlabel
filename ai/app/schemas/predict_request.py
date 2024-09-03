from pydantic import BaseModel
from typing import List, Optional

class PredictRequest(BaseModel):
    projectId: int
    image_path: str
    version: Optional[str] = "latest"
    conf_threshold: Optional[float] = 0.25
    iou_threshold: Optional[float] = 0.45
    classes: Optional[List[int]] = None
