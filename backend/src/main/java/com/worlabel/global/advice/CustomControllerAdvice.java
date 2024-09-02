package com.worlabel.global.advice;

import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.ErrorResponse;
import com.worlabel.global.service.NotificationManager;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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

import java.util.Enumeration;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class CustomControllerAdvice {

    private final NotificationManager notificationManager;

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception e, HttpServletRequest request) {
        log.error("", e);
        sendNotification(e, request);
        return ErrorResponse.of(new CustomException(ErrorCode.SERVER_ERROR));
    }


    @ExceptionHandler({HttpMessageNotReadableException.class})
    public ErrorResponse handleReadableException(Exception e,HttpServletRequest request) {
        log.error("",e);
        sendNotification(e, request);
        return ErrorResponse.of(new CustomException(ErrorCode.BAD_REQUEST));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNoHandlerFoundException(NoResourceFoundException e, HttpServletRequest request) {
        log.error("", e);
        sendNotification(e, request);
        return ErrorResponse.of(new CustomException(ErrorCode.INVALID_URL));
    }

    @ExceptionHandler({MissingServletRequestParameterException.class})
    public ErrorResponse handleRequestParameterException(Exception e, HttpServletRequest request) {
        log.error("",e);
        sendNotification(e, request);
        return ErrorResponse.of(new CustomException(ErrorCode.EMPTY_REQUEST_PARAMETER));
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e, HttpServletRequest request) {
        log.error("", e);
        sendNotification(e, request);
        return ResponseEntity.status(e.getErrorCode().getStatus())
                .body(ErrorResponse.of(e));
    }

    private void sendNotification(Exception e, HttpServletRequest request) {
        // TODO: 추후 주석 해제
//        notificationManager.sendNotification(e, request.getRequestURI(),getParams(request));
    }

    private String getParams(HttpServletRequest req) {
        StringBuilder params = new StringBuilder();
        Enumeration<String> keys = req.getParameterNames();
        while (keys.hasMoreElements()) {
            String key = keys.nextElement();
            params.append("- ").append(key).append(" : ").append(req.getParameter(key)).append("\n");
        }
        return params.toString();
    }

}
