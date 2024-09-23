package com.worlabel.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Common - 1000
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 9999, "서버 에러입니다. 관리자에게 문의해주세요."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, 1000, "잘못된 요청입니다. 요청을 확인해주세요."),
    EMPTY_REQUEST_PARAMETER(HttpStatus.BAD_REQUEST, 1001, "필수 요청 파라미터가 입력되지 않았습니다."),
    FAIL_TO_CREATE_FILE(HttpStatus.BAD_REQUEST, 1002, "파일 업로드에 실패하였습니다. 다시 한번 확인해주세요"),
    FAIL_TO_DELETE_FILE(HttpStatus.BAD_REQUEST, 1003, "파일 삭제에 실패하였습니다. 다시 한번 확인해주세요"),
    INVALID_FILE_PATH(HttpStatus.BAD_REQUEST, 1004, "파일 경로가 잘못되었습니다. 다시 한번 확인해주세요"),
    DATA_NOT_FOUND(HttpStatus.NOT_FOUND, 1005, "해당 데이터를 찾을 수 없습니다."),

    // Auth & Member - 2000
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, 2000, "해당 ID의 사용자를 찾을 수 없습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, 2001, "유효하지 않은 리프레시 토큰입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, 2002, "접근 권한이 없습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, 2003, "올바르지 않는 인증 토큰입니다. 다시 확인 해주세요"),

    // Workspace - 3000
    NOT_AUTHOR(HttpStatus.FORBIDDEN, 3001, "작성자가 아닙니다. 이 작업을 수행할 권한이 없습니다."),
    WORKSPACE_NOT_FOUND(HttpStatus.BAD_REQUEST, 3002, "해당 워크스페이스는 존재하지 않습니다."),
    EARLY_ADD_MEMBER(HttpStatus.BAD_REQUEST, 3003, "이미 추가된 멤버입니다."),

    // Project - 4000
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, 4000, "프로젝트를 찾을 수 없습니다"),
    PROJECT_IMAGE_MISMATCH(HttpStatus.BAD_REQUEST, 4001, "해당 프로젝트에는 존재하지 않는 이미지입니다."),
    PROJECT_CATEGORY_EXIST(HttpStatus.BAD_REQUEST,4002, "이미 존재하는 카테고리입니다."),
    PROJECT_CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, 4003, "해당 카테고리를 찾을 수 없습니다."),

    // Participant - 5000,
    PARTICIPANT_UNAUTHORIZED(HttpStatus.FORBIDDEN, 5000, "해당 프로젝트에 참여하고 있지않습니다."),
    PARTICIPANT_BAD_REQUEST(HttpStatus.FORBIDDEN, 5001, "자기 자신의 권한을 바꿀 수 없습니다."),
    PARTICIPANT_EDITOR_UNAUTHORIZED(HttpStatus.FORBIDDEN, 5002, "해당 프로젝트에 수정 권한이 없습니다."),

    // Folder - 6000,

    // Image - 7000

    // AI - 8000
    AI_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 8000, "AI 서버 오류 입니다."),

    // Comment - 9000,

    // review - 10000,

    ;
    private final HttpStatus status;
    private final int code;
    private final String message;
}
