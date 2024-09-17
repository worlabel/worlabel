from pydantic import BaseModel
from typing import Optional

class LabelCategory(BaseModel):
    id:int
    label:str


class ModelCreateRequest(BaseModel):
    project_id: int
    type: str
    pretrained:bool = True
    labelCategories:Optional[list[LabelCategory]] = None