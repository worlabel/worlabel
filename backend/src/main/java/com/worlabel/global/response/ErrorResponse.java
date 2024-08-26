package com.worlabel.global.response;

import com.worlabel.global.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 에러 발생시 리턴 할 에러 응답 객체
 */
@Slf4j
public class ErrorResponse extends BaseResponse<Void> {

    public ErrorResponse(boolean isSuccess, int code, String message, Errors errors) {
        super(isSuccess, code, message);
        super.errors = parseErrors(errors);
    }

    public ErrorResponse(CustomException exception) {
        this(false, exception.getErrorCode().getCode(), exception.getMessage(), exception.getErrors());
    }

    public ErrorResponse(CustomException exception, String message) {
        this(false, 1, message, exception.getErrors());
    }

    public static ErrorResponse of(CustomException exception) {
        return new ErrorResponse(exception);
    }

    public static ErrorResponse of(CustomException exception, String message) {
        return new ErrorResponse(exception, message);
    }

    public static ErrorResponse of(Exception exception) {
        return new ErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getMessage(), null);
    }

    /**
     * 전달 받은 Errors 커스텀에러로 파싱해주는 메서드
     *
     * @param errors Error 담긴 객체
     * @return CustomError 리스트
     */
    private List<CustomError> parseErrors(Errors errors) {
        if (errors == null) return Collections.emptyList();

        // 필드 에러 리스트 생성
        List<CustomError> fieldErrors = errors.getFieldErrors().stream()
                .map(e -> new CustomError(e.getField(), e.getCode(), e.getDefaultMessage(), e.getObjectName())).toList();

        // 글로벌 에러 리스트 생성
        List<CustomError> globalErrors = errors.getGlobalErrors().stream()
                .map(e -> new CustomError(null, // 필드 이름이 없으므로 null
                         e.getCode(),
                         e.getDefaultMessage(),
                        e.getObjectName()
                ))
                .toList();

        // 두 리스트를 합쳐서 반환
        List<CustomError> allErrors = new ArrayList<>();
        allErrors.addAll(fieldErrors);
        allErrors.addAll(globalErrors);
        return allErrors;
    }
}