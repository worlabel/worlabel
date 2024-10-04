import time

from fastapi import APIRouter, HTTPException
from api.yolo.detection import get_classes, run_predictions, get_random_color, split_data, download_data
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest
from schemas.predict_response import PredictResponse, LabelData
from schemas.train_report_data import ReportData
from schemas.train_response import TrainResponse
from services.load_model import load_segmentation_model
from services.create_model import save_model
from utils.file_utils import get_dataset_root_path, process_directories, join_path
from utils.slackMessage import send_slack_message
from utils.api_utils import send_data_call_api

router = APIRouter()

@router.post("/predict")
async def segmentation_predict(request: PredictRequest):
    project_id = request.project_id
    send_slack_message(f"Segmentation predict 요청 (projectId: {project_id}, 이미지 개수: {len(request.image_list)})",
                       status="success")

    # 모델 로드
    start_time = time.time()
    send_slack_message(f"모델 로드 중 (projectId: {project_id})...", status="success")
    model = get_model(project_id, request.m_key)
    send_slack_message(f"모델 로드 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초", status="success")

    # 이미지 데이터 정리
    start_time = time.time()
    url_list = list(map(lambda x: x.image_url, request.image_list))
    send_slack_message(f"이미지 데이터 정리 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # 이 값을 모델에 입력하면 해당하는 클래스 id만 출력됨
    classes = get_classes(request.label_map, model.names)

    # 추론
    start_time = time.time()
    send_slack_message(f"Segmentation 추론 시작 (projectId: {project_id})...", status="success")
    results = run_predictions(model, url_list, request, classes)
    send_slack_message(f"Segmentation 추론 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # 추론 결과 변환
    start_time = time.time()
    response = [process_prediction_result(result, image, request.label_map) for result, image in
                zip(results, request.image_list)]
    send_slack_message(f"Segmentation predict 성공 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    return response

# 모델 로드
def get_model(project_id:int, model_key:str):
    try:
        return load_segmentation_model(project_id, model_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail="load model exception: " + str(e))

# 추론 결과 처리 함수
def process_prediction_result(result, image, label_map):
    try:
        label_data = LabelData(
            version="0.0.0",
            task_type="seg",
            shapes=[
                {
                    "label": summary['name'],
                    "color": get_random_color(),
                    "points": list(zip(summary['segments']['x'], summary['segments']['y'])),
                    "group_id": label_map[summary['name']],
                    "shape_type": "polygon",
                    "flags": {}
                }
                for summary in result.summary()
            ],
            split="none",
            imageHeight=result.orig_img.shape[0],
            imageWidth=result.orig_img.shape[1],
            imageDepth=result.orig_img.shape[2]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="model predict exception: " + str(e))

    return PredictResponse(
        image_id=image.image_id,
        data=label_data.model_dump_json()
    )


@router.post("/train")
async def segmentation_train(request: TrainRequest):
    project_id = request.project_id

    send_slack_message(f"Segmentation train 요청 (projectId: {project_id} 이미지 개수: {len(request.data)})", status="success")

    # 데이터셋 루트 경로 얻기 (프로젝트 id 기반)
    dataset_root_path = get_dataset_root_path(project_id)

    # 모델 로드
    start_time = time.time()
    send_slack_message(f"모델 로드 중 (projectId: {project_id})...", status="success")
    model = get_model(project_id, request.m_key)
    send_slack_message(f"모델 로드 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초", status="success")

    # 이 값을 학습할때 넣으면 이 카테고리들이 학습됨
    names = list(request.label_map)

    # 레이블 변환기
    start_time = time.time()
    label_converter = {request.label_map[key]: idx for idx, key in enumerate(request.label_map)}
    send_slack_message(f"레이블 변환기 생성 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # 데이터 전처리: 학습할 디렉토리 및 설정 파일 생성
    start_time = time.time()
    send_slack_message(f"데이터 전처리 중 (projectId: {project_id})...", status="success")
    process_directories(dataset_root_path, names)
    send_slack_message(f"데이터 전처리 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # 데이터 전처리: 데이터를 학습데이터와 검증데이터로 분류
    start_time = time.time()
    train_data, val_data = split_data(request.data, request.ratio)
    send_slack_message(f"데이터 분류 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # 데이터 전처리: 데이터 이미지 및 레이블 다운로드
    start_time = time.time()
    send_slack_message(f"데이터 다운로드 중 (projectId: {project_id})...", status="success")
    download_data(train_data, val_data, dataset_root_path, label_converter)
    send_slack_message(f"데이터 다운로드 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # 학습 시작
    start_time = time.time()
    send_slack_message(f"Segmentation 학습 시작 (projectId: {project_id})...", status="success")
    results = run_train(request, model, dataset_root_path)
    send_slack_message(f"Segmentation 학습 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # best 모델 저장
    start_time = time.time()
    send_slack_message(f"모델 저장 중 (projectId: {project_id})...", status="success")
    model_key = save_model(project_id=project_id, path=join_path(dataset_root_path, "result", "weights", "best.pt"))
    send_slack_message(f"모델 저장 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초", status="success")

    result = results.results_dict

    response = TrainResponse(
        modelKey=model_key,
        precision=result["metrics/precision(M)"],
        recall=result["metrics/recall(M)"],
        mAP50=result["metrics/mAP50(M)"],
        mAP5095=result["metrics/mAP50-95(M)"],
        accuracy=0,
        fitness=result["fitness"]
    )
    send_slack_message(f"Segmentation train 성공 (projectId: {project_id}) {response}", status="success")

    return response
    
def run_train(request, model, dataset_root_path):
    try:
        # 데이터 전송 콜백함수
        def send_data(trainer):
            try:
                # 첫번째 epoch는 스킵
                if trainer.epoch == 0:
                    return

                # 남은 시간 계산(초)
                left_epochs = trainer.epochs - trainer.epoch
                left_seconds = left_epochs * trainer.epoch_time

                # 로스 box_loss, cls_loss, dfl_loss
                loss = trainer.label_loss_items(loss_items=trainer.loss_items)
                data = ReportData(
                    epoch=trainer.epoch,             # 현재 에포크
                    total_epochs=trainer.epochs,     # 전체 에포크
                    seg_loss=loss["train/seg_loss"], # seg_loss
                    box_loss=0,                      # box loss          
                    cls_loss=loss["train/cls_loss"], # cls loss
                    dfl_loss=0,                      # dfl loss
                    fitness=trainer.fitness,         # 적합도
                    epoch_time=trainer.epoch_time,   # 지난 에포크 걸린 시간 (에포크 시작 기준으로 결정)
                    left_seconds=left_seconds        # 남은 시간(초)
                )
                # 데이터 전송
                send_data_call_api(request.project_id, request.m_id, data)
            except Exception as e:
                print(f"Exception in send_data(): {e}")

        # 콜백 등록
        model.add_callback("on_train_epoch_start", send_data)

        try:
            # 비동기 함수로 학습 실행
            results = model.train(
                data=join_path(dataset_root_path, "dataset.yaml"),
                name=join_path(dataset_root_path, "result"),
                epochs=request.epochs,
                batch=request.batch,
                lr0=request.lr0,
                lrf=request.lrf,
                optimizer=request.optimizer,
                patience=0
            )
        finally:
            # 콜백 해제 및 자원 해제
            model.reset_callbacks()

        # 마지막 에포크 전송
        model.trainer.epoch += 1
        send_data(model.trainer)
        return results

    except HTTPException as e:
        raise e # HTTP 예외를 다시 발생
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"run_train exception: {e}")







