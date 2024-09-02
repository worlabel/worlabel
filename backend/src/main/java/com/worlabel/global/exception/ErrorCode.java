package com.worlabel.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Common - 1000
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 9999, "서버 에러입니다. 관리자에게 문의해주세요."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, 1000, "올바르지 않은 입력 값입니다. 다시 한번 확인해주세요."),
    EMPTY_FILE(HttpStatus.BAD_REQUEST, 1001, "빈 파일입니다."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, 1002, "잘못된 요청입니다. 요청을 확인해주세요."),
    EMPTY_REQUEST_PARAMETER(HttpStatus.BAD_REQUEST, 1003, "필수 요청 파라미터가 입력되지 않았습니다."),
    INVALID_URL(HttpStatus.BAD_REQUEST, 1004, "제공하지 않는 주소입니다. 확인해주세요"),
    FAIL_TO_CREATE_FILE(HttpStatus.BAD_REQUEST, 1005, "파일 업로드에 실패하였습니다. 다시 한번 확인해주세요"),

    // Auth & Member - 2000
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, 2000, "해당 ID의 사용자를 찾을 수 없습니다."),
    ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, 2001, "만료된 액세스 토큰입니다."),
    REFRESH_TOKEN_MISSING(HttpStatus.BAD_REQUEST, 2002, "리프레시 토큰이 누락되었습니다."),
    REFRESH_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, 2003, "리프레시 토큰이 만료되었습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, 2004, "유효하지 않은 리프레시 토큰입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, 2005, "인증에 실패하였습니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, 2006, "접근 권한이 없습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, 2007, "올바르지 않는 인증 토큰입니다. 다시 확인 해주세요"),
    USER_ALREADY_SIGN_OUT(HttpStatus.UNAUTHORIZED, 2008, "이미 로그아웃한 사용자입니다."),

    // Workspace - 3000
    NOT_AUTHOR(HttpStatus.FORBIDDEN, 3001, "작성자가 아닙니다. 이 작업을 수행할 권한이 없습니다."),
    WORKSPACE_NOT_FOUND(HttpStatus.BAD_REQUEST, 3002, "해당 워크스페이스는 존재하지 않습니다."),
    EARLY_ADD_MEMBER(HttpStatus.BAD_REQUEST, 3003, "이미 추가된 멤버입니다."),

    // Project - 4000
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, 4000, "프로젝트를 찾을 수 없습니다"),

    // Participant - 5000,
    PARTICIPANT_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, 5000, "해당 프로젝트에 접근 권한이 없습니다."),
    PARTICIPANT_BAD_REQUEST(HttpStatus.UNAUTHORIZED, 5001, "자기 자신의 권한을 바꿀 수 없습니다."),

    // Folder - 6000,
    FOLDER_NOT_FOUND(HttpStatus.NOT_FOUND, 6000, "해당 폴더를 찾을 수 없습니다."),
    FOLDER_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, 6001, "해당 폴더에 접근 권한이 없습니다."),

    // Image - 7000
    IMAGE_NOT_FOUND(HttpStatus.NOT_FOUND, 7000,"해당 이미지를 찾을 수 없습니다."),

    ;

    private final HttpStatus status;
    private final int code;
    private final String message;
}
