from fastapi import FastAPI
from api.yolo.detection import router as yolo_detection_router
from api.yolo.segmentation import router as yolo_segmentation_router

app = FastAPI()

# 각 기능별 라우터를 애플리케이션에 등록
app.include_router(yolo_detection_router, prefix="/api")
app.include_router(yolo_segmentation_router, prefix="/api")

# 애플리케이션 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)
