package com.worlabel.global.handler;

import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        log.debug("인증 실패 오류 : {} ", request.getAttribute("error-message"));
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        CustomException exception = new CustomException(ErrorCode.INVALID_TOKEN);
        if (request.getAttribute("error-message") == null) {
            request.setAttribute("error-message", exception.getMessage());
        }
        ErrorResponse errorResponse = new ErrorResponse(exception, request.getAttribute("error-message").toString());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(errorResponse.toJson());
    }
}
