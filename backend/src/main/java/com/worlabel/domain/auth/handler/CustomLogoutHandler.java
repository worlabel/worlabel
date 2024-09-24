package com.worlabel.domain.auth.handler;

import com.worlabel.domain.auth.service.AuthService;
import com.worlabel.domain.auth.service.JwtTokenService;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {

    private AuthService authService;
    private JwtTokenService jwtTokenService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String token = request.getHeader("Authorization");
        try {
            String refreshedToken = token.substring(7);
            int memberId = jwtTokenService.parseId(refreshedToken);

            authService.deleteRefreshToken(memberId);
            authService.deleteFcmToken(memberId);

            log.debug("로그아웃된 사용자의 토큰이 삭제 됨 {}", memberId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
    }
}
