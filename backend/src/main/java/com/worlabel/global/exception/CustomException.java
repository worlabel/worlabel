package com.worlabel.global.exception;

import lombok.Getter;
import org.springframework.validation.Errors;

import java.util.Objects;

@Getter
public class CustomException extends RuntimeException{
    private final ErrorCode errorCode;
    private Errors errors;

    public CustomException(ErrorCode errorCode) {
        this(errorCode, errorCode.getMessage(), null);
    }

    public CustomException(ErrorCode errorCode, String message) {
        this(errorCode, message, null);
    }

    public CustomException(ErrorCode errorCode, Errors errors) {
        this(errorCode, errorCode.getMessage(), errors);
    }

    public CustomException(ErrorCode errorCode, String message, Errors errors) {
        super(message);
        this.errorCode = errorCode;
        this.errors = errors;
    }

    public boolean hasErrors(){
        return Objects.nonNull(errors) && errors.hasErrors();
    }
}
