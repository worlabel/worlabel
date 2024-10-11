from pydantic import BaseModel
from typing import List, Optional, Tuple, Dict

class Shape(BaseModel):
    label: str
    color: str
    points: List[Tuple[float, float]]
    group_id: Optional[int] = None
    shape_type: str
    flags: Dict[str, Optional[bool]] = {}

class LabelData(BaseModel):
    version: str
    task_type: str
    shapes: List[Shape]
    split: str
    imageHeight: int
    imageWidth: int
    imageDepth: int

class PredictResponse(BaseModel):
    image_id: int
    data: str