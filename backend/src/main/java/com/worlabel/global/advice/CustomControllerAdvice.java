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
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

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

    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNoHandlerFoundException(NoResourceFoundException e) {
        log.error("", e);
        return ErrorResponse.of(new CustomException(ErrorCode.INVALID_URL));
    }

    @ExceptionHandler({MissingServletRequestParameterException.class})
    public ErrorResponse handleRequestParameterException(Exception e) {
        log.error("",e);
        return ErrorResponse.of(new CustomException(ErrorCode.EMPTY_REQUEST_PARAMETER));
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {
        log.error("", e);
        return ResponseEntity.status(e.getErrorCode().getStatus())
                .body(ErrorResponse.of(e));
    }
}
