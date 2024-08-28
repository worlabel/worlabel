package com.worlabel.global.handler;

import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomAuthenticationDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        log.debug("오류 : {}", request.getAttribute("error-message"));
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        CustomException exception = new CustomException(ErrorCode.Access_DENIED);
        ErrorResponse errorResponse = new ErrorResponse(exception, request.getAttribute("error-message").toString());
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(errorResponse.toJson());
    }
}
