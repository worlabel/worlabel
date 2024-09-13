package com.worlabel.domain.auth.handler;

import com.worlabel.domain.auth.entity.CustomOAuth2User;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.repository.AuthCacheRepository;
import com.worlabel.domain.auth.service.JwtTokenService;
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
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${frontend.url}") private String frontEnd;
    @Value("${auth.refreshTokenExpiry}") long refreshExpiry;
    private final AuthCacheRepository authCacheRepository;
    private final JwtTokenService jwtTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // OAuth2User
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        StringBuffer requestURL = request.getRequestURL();
        String originalUri = request.getRequestURI();
        String baseUrl = requestURL.substring(0, requestURL.length() - originalUri.length());

        // JWT 토큰 생성
        JwtToken jwtToken = jwtTokenService.generateTokenByOAuth2User(customOAuth2User);

        // 쿼리 파라미터로 액세스 토큰 전달
        String redirectUrl = UriComponentsBuilder.fromUriString(baseUrl + "/redirect/oauth2")
                .queryParam("accessToken", jwtToken.getAccessToken())
                .toUriString();
        // 쿠키에 리프레시 토큰 추가
        response.addCookie(createCookie(jwtToken.getRefreshToken()));
        authCacheRepository.save(customOAuth2User.getId(), jwtToken.getRefreshToken(), refreshExpiry);

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private Cookie createCookie(String value) {
        Cookie cookie = new Cookie("refreshToken", value);
        cookie.setMaxAge((int) (refreshExpiry / 1000));
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // 배포 시 HTTPS에서 사용
        return cookie;
    }

}
