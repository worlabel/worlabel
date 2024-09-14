package com.worlabel.global.advice;

import com.amazonaws.Response;
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
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.lang.reflect.Executable;
import java.util.Enumeration;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class CustomControllerAdvice {

    private final NotificationManager notificationManager;

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public void handleException(Exception e, HttpServletRequest request) {
        sendNotification(e, request);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler({NoResourceFoundException.class})
    public void handleNotFountException(NoResourceFoundException e, HttpServletRequest request) {
        sendNotification(e, request);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({HttpRequestMethodNotSupportedException.class, MissingServletRequestParameterException.class, HttpMessageNotReadableException.class})
    public void handleBadRequestException(Exception e, HttpServletRequest request) {
        sendNotification(e, request);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Void> handleCustomException(CustomException e, HttpServletRequest request) {
        sendNotification(e, request);
        return ResponseEntity.status(e.getErrorCode().getStatus()).build();
    }

    private void sendNotification(Exception e, HttpServletRequest request) {
        log.error("", e);
        notificationManager.sendNotification(e, request.getRequestURI(), getParams(request));
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
