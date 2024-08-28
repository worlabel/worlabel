package com.worlabel.global.handler;

import com.worlabel.domain.auth.entity.CustomOAuth2Member;
import com.worlabel.global.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    // TODO : 추후 도메인 혹은 배포시 설정
    @Value("${frontend.url}")
    private String frontEnd;

    private final JWTUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // OAuth2User
        CustomOAuth2Member customOAuth2Member = (CustomOAuth2Member) authentication.getPrincipal();
        log.debug("로그인 성공 : {}", customOAuth2Member);

        String username = customOAuth2Member.getName();
        String role = authentication.getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority())
                .toList()
                .get(0);

        // JWT 토큰 생성
        String token = jwtUtil.createJwtToken(username, role, 60 * 60 * 1000L, "access");
        // 쿠키에 JWT 토큰 추가
        response.addCookie(createCookie("Authorization", token));

        // 성공 시 리다이렉트할 URL 설정
//        String redirectUrl = frontEnd + "/";  // 적절한 리다이렉트 URL로 수정
//        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        super.onAuthenticationSuccess(request, response, authentication);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        // TODO: 추후 변경
        cookie.setMaxAge(60 * 60 * 60); // 개발 단계에서는 유효기간 길게
        cookie.setPath("/"); // 쿠키 경로를 전체 경로로 설정
        cookie.setHttpOnly(true); // HttpOnly 설정, JavaScript 접근 불가
//        cookie.setSecure(true); // TODO: 배포시 HTTPS 환경에서 사용
        return cookie;
    }
}
