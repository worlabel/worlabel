from pydantic import BaseModel, Field


class Segment(BaseModel):
    x: float = Field(..., ge=0, le=1)
    y: float = Field(..., ge=0, le=1)

    def to_string(self) -> str:
        return f"{self.x} {self.y}"

class DetectionLabelData(BaseModel):
    label_id: int = Field(..., ge=0)
    center_x: float = Field(..., ge=0, le=1)
    center_y: float = Field(..., ge=0, le=1)
    width: float = Field(..., ge=0, le=1)
    height: float = Field(..., ge=0, le=1)

    def to_string(self) -> str:
        return f"{self.label_id} {self.center_x} {self.center_y} {self.width} {self.height}"


class SegmentationLabelData(BaseModel):
    label_id: int
    segments: list[Segment]

    def to_string(self) -> str:
        points_str = " ".join([segment.to_string() for segment in self.segments])
        return f"{self.label_id} {points_str}"