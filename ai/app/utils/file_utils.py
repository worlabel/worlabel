import os
import shutil
import yaml
from PIL import Image
from schemas.train_request import TrainDataInfo

def get_dataset_root_path(project_id):
    """데이터셋 루트 절대 경로 반환"""
    return os.path.join(os.getcwd(), 'datasets', 'train')

def make_dir(path:str, init: bool):
    """
    path : 디렉토리 경로
    init : 폴더를 초기화 할지 여부
    """
    if (os.path.exists(path) and init):
        shutil.rmtree(path)
    os.makedirs(path, exist_ok=True)

def make_yml(path:str):
    data = {
        "train": f"{path}/train",
        "val": f"{path}/val",
        "nc": 80,
        "names": 
        {
            0: "person",
            1: "bicycle",
            2: "car",
            3: "motorcycle",
            4: "airplane",
            5: "bus",
            6: "train",
            7: "truck",
            8: "boat",
            9: "traffic light",
            10: "fire hydrant",
            11: "stop sign",
            12: "parking meter",
            13: "bench",
            14: "bird",
            15: "cat",
            16: "dog",
            17: "horse",
            18: "sheep",
            19: "cow",
            20: "elephant",
            21: "bear",
            22: "zebra",
            23: "giraffe",
            24: "backpack",
            25: "umbrella",
            26: "handbag",
            27: "tie",
            28: "suitcase",
            29: "frisbee",
            30: "skis",
            31: "snowboard",
            32: "sports ball",
            33: "kite",
            34: "baseball bat",
            35: "baseball glove",
            36: "skateboard",
            37: "surfboard",
            38: "tennis racket",
            39: "bottle",
            40: "wine glass",
            41: "cup",
            42: "fork",
            43: "knife",
            44: "spoon",
            45: "bowl",
            46: "banana",
            47: "apple",
            48: "sandwich",
            49: "orange",
            50: "broccoli",
            51: "carrot",
            52: "hot dog",
            53: "pizza",
            54: "donut",
            55: "cake",
            56: "chair",
            57: "couch",
            58: "potted plant",
            59: "bed",
            60: "dining table",
            61: "toilet",
            62: "tv",
            63: "laptop",
            64: "mouse",
            65: "remote",
            66: "keyboard",
            67: "cell phone",
            68: "microwave",
            69: "oven",
            70: "toaster",
            71: "sink",
            72: "refrigerator",
            73: "book",
            74: "clock",
            75: "vase",
            76: "scissors",
            77: "teddy bear",
            78: "hair drier",
            79: "toothbrush"
        }
    }
    with open(os.path.join(path, "dataset.yaml"), 'w') as f:
        yaml.dump(data, f)

def process_directories(dataset_root_path:str):
    """학습을 위한 디렉토리 생성"""
    make_dir(dataset_root_path, init=False)
    make_dir(os.path.join(dataset_root_path, "train"), init=True)
    make_dir(os.path.join(dataset_root_path, "val"), init=True)
    if os.path.exists(os.path.join(dataset_root_path, "result")):
        shutil.rmtree(os.path.join(dataset_root_path, "result"))
    make_yml(dataset_root_path)

def process_image_and_label(data:TrainDataInfo, dataset_root_path:str, child_path:str):
    
    """이미지 저장 및 레이블 파일 생성"""
    # 이미지 저장
    img = Image.open(data.image_url)
    
    # 파일명에서 확장자를 제거하여 img_title과 img_ext 생성
    img_title, img_ext = os.path.splitext(os.path.basename(data.image_url))
    
    # 이미지 파일 저장 (확장자를 그대로 사용)
    img.save(os.path.join(dataset_root_path, child_path, img_title + img_ext))

    # 레이블 -> 학습용 레이블 데이터 파싱(detection)
    label = data.label
    with open(os.path.join(dataset_root_path, child_path, f"{img_title}.txt"), "w") as train_label_txt:
        for shape in label.shapes:
            train_label = []
            x1 = shape.points[0][0]
            y1 = shape.points[0][1]
            x2 = shape.points[1][0]
            y2 = shape.points[1][1]
            train_label.append(str(shape.group_id)) # label Id
            train_label.append(str((x1 + x2) / 2 / label.imageWidth))   # 중심 x 좌표
            train_label.append(str((y1 + y2) / 2 / label.imageHeight))  # 중심 y 좌표
            train_label.append(str((x2 - x1) / label.imageWidth))       # 너비
            train_label.append(str((y2 - y1) / label.imageHeight ))     # 높이
            train_label_txt.write(" ".join(train_label)+"\n")

def join_path(path, *paths):
    """os.path.join()과 같은 기능, os import 하기 싫어서 만듦"""
    return os.path.join(path, *paths)

def get_model_paths(project_id:int):
    path = os.path.join("resources","projects",str(project_id), "models")
    if not os.path.exists(path):
        raise FileNotFoundError()
    files = os.listdir(path)
    return [os.path.join(path, file) for file in files if file.endswith(".pt")]

def delete_file(path):
    os.remove(path)