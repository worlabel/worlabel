package com.worlabel.global.advice;

import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class CustomControllerAdvice {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception e) {
        log.error("", e);
        return ErrorResponse.of(new CustomException(ErrorCode.SERVER_ERROR));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class})
    public ErrorResponse handleReadableException(Exception exception) {
        log.error("",exception);
        return ErrorResponse.of(new CustomException(ErrorCode.BAD_REQUEST));
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {
        log.error("", e);
        return ResponseEntity.status(e.getErrorCode().getStatus())
                .body(ErrorResponse.of(e));
    }

    @ExceptionHandler({MissingServletRequestParameterException.class})
    public ErrorResponse handleRequestParameterException(Exception e) {
        log.error("",e);
        return ErrorResponse.of(new CustomException(ErrorCode.EMPTY_REQUEST_PARAMETER));
    }
}
