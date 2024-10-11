# FastAPI를 이용한 AI 모델 관련 API

## conda 환경 세팅
```bash
conda env create -f environment.yml
conda activate worlabel_ai_env
```

## FastAPI Project 구조

### app/api
- api 호출 라우터 정의

### app/schemas
- api의 request/response 등 Pydantic 모델 정의

### app/services
- AI 관련 패키지를 이용하는 메서드 정의

### app/utils
- 프로젝트 전역에서 이용하는 formatter 등 정의

### resources/models
- yolo 기본 모델 6종(default/pretrained, det/seg/cls) 저장

### resources/projects/{project_id}/models
- 프로젝트별 ai 모델 저장

### resources/datasets
- 훈련 데이터셋 저장