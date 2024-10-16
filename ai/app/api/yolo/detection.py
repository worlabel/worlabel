import os
import time

import psutil
from fastapi import APIRouter, HTTPException
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest, TrainDataInfo
from schemas.predict_response import PredictResponse, LabelData, Shape
from schemas.train_report_data import ReportData
from schemas.train_response import TrainResponse
from services.load_model import load_detection_model
from services.create_model import save_model
from utils.file_utils import get_dataset_root_path, process_directories, join_path, process_image_and_label
from utils.slackMessage import send_slack_message
from utils.api_utils import send_data_call_api
import random, torch


router = APIRouter()

@router.post("/predict")
async def detection_predict(request: PredictRequest):
    project_id = request.project_id
    send_slack_message(f"Detection predict 요청 (projectId: {project_id})", status="success")

    # 모델 로드
    start_time = time.time()
    send_slack_message(f"모델 로드 중 (projectId: {project_id})...", status="success")
    model = get_model(request.project_id, request.m_key)
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
    send_slack_message(f"추론 시작 (projectId: {project_id})...", status="success")
    results = run_predictions(model, url_list, request, classes)
    send_slack_message(f"추론 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초", status="success")

    # 추론 결과 변환
    start_time = time.time()
    response = [process_prediction_result(result, image, request.label_map) for result, image in
                zip(results, request.image_list)]
    send_slack_message(f"추론 결과 변환 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    send_slack_message(f"Detection predict 성공 (projectId: {project_id}) {len(response)}", status="success")

    return response

# 모델 로드
def get_model(project_id, model_key):
    try:
        return load_detection_model(project_id, model_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in get_model(): " + str(e))

# 모델의 레이블로부터 label_map의 key에 존재하는 값의 id만 가져오기
def get_classes(label_map:dict[str: int], model_names: dict[int, str]):
    try:
        return [id for id, name in model_names.items() if name in label_map]
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in get_classes(): " + str(e))

# 추론 실행 함수
def run_predictions(model, image, request, classes):
    try:
        with torch.no_grad():
            results = []
            for img in image:
                result = model.predict(
                    source=[img],
                    iou=request.iou_threshold,
                    conf=request.conf_threshold,
                    classes=classes
                )
                results += result
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in run_predictions: " + str(e))

# 추론 결과 처리 함수
def process_prediction_result(result, image, label_map):
    try:
        label_data = LabelData(
            version="0.0.0",
            task_type="det",
            shapes=[
                Shape(
                    label= summary['name'],
                    color= get_random_color(),
                    points= [
                        [summary['box']['x1'], summary['box']['y1']],
                        [summary['box']['x2'], summary['box']['y2']]
                    ],
                    group_id= label_map[summary['name']],
                    shape_type= "rectangle",
                    flags= {}
                )
                for summary in result.summary()
            ],
            split="none",
            imageHeight=result.orig_img.shape[0],
            imageWidth=result.orig_img.shape[1],
            imageDepth=result.orig_img.shape[2]
        )
    except KeyError as e:
        raise HTTPException(status_code=500, detail="KeyError: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in process_prediction_result(): " + str(e))

    return PredictResponse(
        image_id=image.image_id,
        data=label_data.model_dump_json()
    )

def get_random_color():
    random_number = random.randint(0, 0xFFFFFF)
    return f"#{random_number:06X}"

@router.post("/train", response_model=TrainResponse)
async def detection_train(request: TrainRequest):

    send_slack_message(f"Detection train 요청 projectId : {request.project_id}, 이미지 개수:{len(request.data)}", status="success")

    # 데이터셋 루트 경로 얻기 (프로젝트 id 기반)
    
    dataset_root_path = get_dataset_root_path(request.project_id)
    
    # 모델 로드
    project_id = request.project_id
    start_time = time.time()
    send_slack_message(f"모델 로드 중 (projectId: {project_id})...", status="success")
    model = get_model(project_id, request.m_key)
    send_slack_message(f"모델 로드 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초", status="success")

    # 이 값을 학습할때 넣으면 이 카테고리들이 학습됨
    names = list(request.label_map)

    # 레이블 변환기 (file_util.py/create_detection_train_label() 에 쓰임)
    label_converter = {request.label_map[key]:idx for idx, key in enumerate(request.label_map)}
    # key : 데이터에 저장된 프로젝트 카테고리 id
    # value : 모델에 저장될 카테고리 id (모델에는 key의 idx 순서대로 저장될 것임)
    
    # 데이터 전처리: 학습할 디렉토리 & 데이터셋 설정 파일을 생성
    start_time = time.time()
    send_slack_message(f"데이터 전처리 시작: 학습 디렉토리 및 설정 파일 생성 중 (projectId: {project_id})...", status="success")
    process_directories(dataset_root_path, names)
    send_slack_message(f"데이터 전처리 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초",
                       status="success")

    # 데이터 전처리: 데이터를 학습데이터와 검증데이터로 분류
    start_time = time.time()
    send_slack_message(f"데이터 분류 중 (projectId: {project_id})...", status="success")
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
    send_slack_message(f"학습 시작 (projectId: {project_id})...", status="success")
    results = run_train(request, model, dataset_root_path)
    send_slack_message(f"학습 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초", status="success")

    # best 모델 저장
    start_time = time.time()
    send_slack_message(f"모델 저장 중 (projectId: {project_id})...", status="success")
    model_key = save_model(project_id=project_id, path=join_path(dataset_root_path, "result", "weights", "best.pt"))
    send_slack_message(f"모델 저장 완료 (projectId: {project_id}). 걸린 시간: {time.time() - start_time:.2f} 초", status="success")

    result = results.results_dict

    response = TrainResponse(
        modelKey=model_key,
        precision= result["metrics/precision(B)"],
        recall= result["metrics/recall(B)"],
        mAP50= result["metrics/mAP50(B)"],
        mAP5095= result["metrics/mAP50-95(B)"],
        accuracy=0,
        fitness= result["fitness"]
    )
    send_slack_message(f"Detection train 성공 (projectId: {project_id}) {response}", status="success")

    return response

def split_data(data:list[TrainDataInfo], ratio:float):
    try:
        train_size = int(ratio * len(data))
        random.shuffle(data)
        train_data = data[:train_size]
        val_data = data[train_size:]
        
        if not train_data or not val_data:
            raise Exception("data size is too small")
        return train_data, val_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in split_data(): " + str(e))

def download_data(train_data:list[TrainDataInfo], val_data:list[TrainDataInfo], dataset_root_path:str, label_converter:dict[int, int]):
    try:
        for data in train_data:
            process_image_and_label(data, dataset_root_path, "train", label_converter)

        for data in val_data:
            process_image_and_label(data, dataset_root_path, "val", label_converter)
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in download_data(): " + str(e))
    
def run_train(request, model, dataset_root_path):
    try:
        # 콜백 함수 정의
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
                    seg_loss=0,                      # seg_loss
                    box_loss=loss["train/box_loss"], # box loss
                    cls_loss=loss["train/cls_loss"], # cls loss
                    dfl_loss=loss["train/dfl_loss"], # dfl loss
                    fitness=trainer.fitness,         # 적합도
                    epoch_time=trainer.epoch_time,   # 지난 에포크 걸린 시간 (에포크 시작 기준으로 결정)
                    left_seconds=left_seconds        # 남은 시간(초)
                )
                # 데이터 전송
                send_data_call_api(request.project_id, request.m_id, data)
            except Exception as e:
                # 예외 처리
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
            torch.cuda.empty_cache()
        
        # 마지막 에포크 전송
        model.trainer.epoch += 1
        send_data(model.trainer)
        return results
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"exception in run_train(): {e}")

@router.get("/memory")
async def get_memory_status():
    # GPU 메모리 정보 가져오기 (torch.cuda 사용)
    if torch.cuda.is_available():
        # 현재 활성화된 CUDA 디바이스 번호 확인
        current_device = torch.cuda.current_device()

        total_gpu_memory = torch.cuda.get_device_properties(current_device).total_memory
        allocated_gpu_memory = torch.cuda.memory_allocated(current_device)
        reserved_gpu_memory = torch.cuda.memory_reserved(current_device)

        gpu_memory = {
            "current_device" : current_device,
            "total": total_gpu_memory / (1024 ** 3),  # 전체 GPU 메모리 (GB 단위)
            "allocated": allocated_gpu_memory / (1024 ** 3),  # 현재 사용 중인 GPU 메모리 (GB 단위)
            "reserved": reserved_gpu_memory / (1024 ** 3),  # 예약된 GPU 메모리 (GB 단위)
            "free": (total_gpu_memory - reserved_gpu_memory) / (1024 ** 3)  # 사용 가능한 GPU 메모리 (GB 단위)
        }
        return gpu_memory
    else:
        raise HTTPException(status_code=404, detail="GPU가 사용 가능하지 않습니다.")