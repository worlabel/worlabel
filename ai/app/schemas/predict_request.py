from pydantic import BaseModel, Field

class ImageInfo(BaseModel):
    image_id: int
    image_url: str


class PredictRequest(BaseModel):
    project_id: int
    m_key: str = Field("yolo8", alias="model_key")  # model_ 로 시작하는 변수를 BaseModel의 변수로 만들경우 Warning 떠서 m_key로 대체
    label_map: dict[str, int] = Field(..., description="프로젝트 레이블 이름: 프로젝트 레이블 pk")
    image_list: list[ImageInfo]  # 이미지 리스트
    conf_threshold: float = Field(0.25, gt=0, lt= 1)
    iou_threshold: float = Field(0.45, gt=0, lt= 1)
