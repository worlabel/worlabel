import os
import shutil
import yaml
from PIL import Image
from schemas.train_request import TrainDataInfo
from schemas.train_label_data import DetectionLabelData, SegmentationLabelData, Segment
import urllib
import json

def get_dataset_root_path(project_id):
    """데이터셋 루트 절대 경로 반환"""
    return os.path.join(os.getcwd(), 'resources', 'projects', str(project_id), "train")

def make_dir(path:str, init: bool):
    """
    path : 디렉토리 경로
    init : 폴더를 초기화 할지 여부
    """
    if (os.path.exists(path) and init):
        shutil.rmtree(path)
    os.makedirs(path, exist_ok=True)

def make_yml(path:str, model_categories):
    data = {
        "train": f"{path}/train",
        "val": f"{path}/val",
        "nc": len(model_categories),
        "names": model_categories
    }
    with open(os.path.join(path, "dataset.yaml"), 'w') as f:
        yaml.dump(data, f)

def process_directories(dataset_root_path:str, model_categories:list[str]):
    """학습을 위한 디렉토리 생성"""
    make_dir(dataset_root_path, init=False)
    make_dir(os.path.join(dataset_root_path, "train"), init=True)
    make_dir(os.path.join(dataset_root_path, "val"), init=True)
    if os.path.exists(os.path.join(dataset_root_path, "result")):
        shutil.rmtree(os.path.join(dataset_root_path, "result"))
    make_yml(dataset_root_path, model_categories)

def process_image_and_label(data:TrainDataInfo, dataset_root_path:str, child_path:str, label_converter:dict[int,int]):
    """이미지 저장 및 레이블 파일 생성"""
    # 이미지 url로부터 파일명 분리
    img_name = data.image_url.split('/')[-1]

    img_path = os.path.join(dataset_root_path,child_path,img_name)

    # url로부터 이미지 다운로드
    urllib.request.urlretrieve(data.image_url, img_path)

    # 파일명에서 확장자를 제거하여 img_title을 얻는다
    img_title = os.path.splitext(os.path.basename(img_path))[0]

    # 레이블 파일 경로
    label_path = os.path.join(dataset_root_path, child_path, f"{img_title}.txt")

    # 레이블 객체 불러오기
    label = json.loads(urllib.request.urlopen(data.data_url).read())

    # 레이블 -> 학습용 레이블 데이터 파싱 후 생성
    if label['task_type'] == "det":
        create_detection_train_label(label, label_path, label_converter)
    elif label["task_type"] == "seg":
        create_segmentation_train_label(label, label_path, label_converter)

def create_detection_train_label(label:dict, label_path:str, label_converter:dict[int, int]):
    with open(label_path, "w") as train_label_txt:
        for shape in label["shapes"]:
            x1 = shape["points"][0][0]
            y1 = shape["points"][0][1]
            x2 = shape["points"][1][0]
            y2 = shape["points"][1][1]
            detection_label = DetectionLabelData(
                label_id= label_converter[shape["group_id"]],     # 모델의 id  (converter : pjt category pk -> model category  id)
                center_x= (x1 + x2) / 2 / label["imageWidth"],    # 중심 x 좌표
                center_y= (y1 + y2) / 2 / label["imageHeight"],   # 중심 y 좌표
                width= (x2 - x1) / label["imageWidth"],           # 너비
                height= (y2 - y1) / label["imageHeight"]          # 높이
            )
            
            train_label_txt.write(detection_label.to_string()+"\n") # str변환 후 txt에 쓰기

def create_segmentation_train_label(label:dict, label_path:str, label_converter:dict[int, int]):
    with open(label_path, "w") as train_label_txt:
        for shape in label["shapes"]:
            segmentation_label = SegmentationLabelData(
                label_id = label_converter[shape["group_id"]],      # label Id
                segments = [
                    Segment(
                        x=x / label["imageWidth"],          # shapes의 points 갯수만큼 x, y 반복
                        y=y / label["imageHeight"]
                    ) for x, y in shape["points"]
                ]
            )
            train_label_txt.write(segmentation_label.to_string()+"\n")
            
def join_path(path, *paths):
    """os.path.join()과 같은 기능, os import 하기 싫어서 만듦"""
    return os.path.join(path, *paths)

def get_model_keys(project_id:int):
    path = os.path.join("resources","projects",str(project_id), "models")
    if not os.path.exists(path):
        raise FileNotFoundError()
    files = os.listdir(path)
    return files

def delete_file(path):
    if not os.path.exists(path):
        raise FileNotFoundError()
    os.remove(path)

def save_file(path, file):
    # 경로에서 디렉토리 부분만 추출 (파일명을 제외한 경로)
    dir_path = os.path.dirname(path)
    os.makedirs(dir_path, exist_ok=True)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

def get_file_name(path):
    if not os.path.exists(path):
        raise FileNotFoundError()
    return os.path.basename(path)

def process_directories_in_cls(dataset_root_path:str, model_categories:list[str]):
    """classification 학습을 위한 디렉토리 생성"""
    make_dir(dataset_root_path, init=False)
    for category in model_categories:
        make_dir(os.path.join(dataset_root_path, "train", category), init=True)
        make_dir(os.path.join(dataset_root_path, "test", category), init=True)
    if os.path.exists(os.path.join(dataset_root_path, "result")):
        shutil.rmtree(os.path.join(dataset_root_path, "result"))

def process_image_and_label_in_cls(data:TrainDataInfo, dataset_root_path:str, child_path:str):
    """이미지 저장 및 레이블 파일 생성"""
    # 이미지 url로부터 파일명 분리
    img_name = data.image_url.split('/')[-1]

    # 레이블 객체 불러오기
    label = json.loads(urllib.request.urlopen(data.data_url).read())

    if not label["shapes"]:
        # assert label["shapes"], No Label. Failed Download" # AssertionError 발생
        print("No Label. Failed Download")
        return
    label_name = label["shapes"][0]["label"]

    label_path = os.path.join(dataset_root_path,child_path,label_name)

    # url로부터 이미지 다운로드
    if os.path.exists(label_path):
        urllib.request.urlretrieve(data.image_url, os.path.join(label_path, img_name))
    else:
        # raise FileNotFoundError("No Label Category. Failed Download")
        print("No Label Category. Failed Download")
    # 레이블 데이터 중에서 프로젝트 카테고리에 해당되지않는 데이터가 있는 경우 처리 1. 에러 raise 2. 무시(+ warning)

    