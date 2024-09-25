import os
import shutil
import yaml
from PIL import Image
from schemas.train_request import TrainDataInfo
from schemas.predict_response import LabelData
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

def make_yml(path:str, names):
    data = {
        "train": f"{path}/train",
        "val": f"{path}/val",
        "nc": 80,
        "names": names
    }
    with open(os.path.join(path, "dataset.yaml"), 'w') as f:
        yaml.dump(data, f)

def process_directories(dataset_root_path:str, names:list[str]):
    """학습을 위한 디렉토리 생성"""
    make_dir(dataset_root_path, init=False)
    make_dir(os.path.join(dataset_root_path, "train"), init=True)
    make_dir(os.path.join(dataset_root_path, "val"), init=True)
    if os.path.exists(os.path.join(dataset_root_path, "result")):
        shutil.rmtree(os.path.join(dataset_root_path, "result"))
    make_yml(dataset_root_path, names)

def process_image_and_label(data:TrainDataInfo, dataset_root_path:str, child_path:str, label_map:dict[int, int]|None):
    
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

    # 레이블 역직렬화
    label = json_to_object(data.label)

    # 레이블 -> 학습용 레이블 데이터 파싱 후 생성
    create_detection_train_label(label, label_path, label_map)

def create_detection_train_label(label:LabelData, label_path:str, label_map:dict[int, int]|None):
    with open(label_path, "w") as train_label_txt:
        for shape in label.shapes:
            train_label = []
            x1 = shape.points[0][0]
            y1 = shape.points[0][1]
            x2 = shape.points[1][0]
            y2 = shape.points[1][1]
            train_label.append(str(label_map[shape.group_id]) if label_map else str(shape.group_id)) # label Id
            train_label.append(str((x1 + x2) / 2 / label.imageWidth))   # 중심 x 좌표
            train_label.append(str((y1 + y2) / 2 / label.imageHeight))  # 중심 y 좌표
            train_label.append(str((x2 - x1) / label.imageWidth))       # 너비
            train_label.append(str((y2 - y1) / label.imageHeight ))     # 높이
            train_label_txt.write(" ".join(train_label)+"\n")

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

def json_to_object(json_string):
    try:
        # JSON 문자열을 Python 객체로 변환
        python_object = json.loads(json_string)
        return python_object
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError("json_decode_error:"+str(e))
    except Exception as e:
        raise Exception("exception at json_to_object:"+str(e))