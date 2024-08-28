package com.worlabel.global.handler;

import com.worlabel.domain.auth.entity.CustomOAuth2User;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.service.JwtTokenService;
import com.worlabel.global.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontEnd;

    private final JwtTokenService jwtTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // OAuth2User
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        log.debug("로그인 성공 : {}", customOAuth2User);

        // JWT 토큰 생성
        JwtToken jwtToken = jwtTokenService.generateToken(customOAuth2User.getId());

        // 헤더에 액세스 토큰 추가
        response.setHeader("Authorization", jwtToken.getAccessToken());
        
        // 쿠키에 리프레시 토큰 추가
        response.addCookie(createCookie(jwtToken.getRefreshToken()));

        // 성공 시 리다이렉트할 URL 설정
        String redirectUrl = frontEnd + "/";  // TODO: 적절한 리다이렉트 URL로 수정
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private Cookie createCookie(String value) {
        Cookie cookie = new Cookie("refreshToken", value);
        int refreshTokenExpiryInSeconds = (int) ((System.currentTimeMillis() + jwtTokenService.getRefreshTokenExpiration()) / 1000); // 리프레시 토큰 만료 시간과 일치
        cookie.setMaxAge(refreshTokenExpiryInSeconds);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        // cookie.setSecure(true); // 배포 시 HTTPS에서 사용
        return cookie;
    }

}
