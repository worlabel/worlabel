from pydantic import BaseModel
from typing import Literal

class ModelCreateRequest(BaseModel):
    project_type: Literal["segmentation", "detection", "classification"]
    pretrained:bool = True