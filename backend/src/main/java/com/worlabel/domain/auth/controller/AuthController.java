package com.worlabel.domain.auth.controller;

import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.service.AuthService;
import com.worlabel.domain.auth.service.JwtTokenService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.SuccessResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Value("${auth.refreshTokenExpiry}")
    long refreshExpiry;

    // TODO: 리이슈 처리, 액세스 어떻게 받았는지 물어보기
    @PostMapping("/reissue")
    public SuccessResponse<Void> reissue(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        log.info("reissue");
        String refresh = parseRefreshCookie(request);
        try {
            JwtToken newToken = authService.reissue(refresh);
            response.addCookie(createCookie(newToken.getRefreshToken()));
            return SuccessResponse.empty();
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_TOKEN, e.getMessage());
        }
    }

    private Cookie createCookie(String value) {
        Cookie cookie = new Cookie("refreshToken", value);
        cookie.setMaxAge((int) (refreshExpiry / 1000));
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        // cookie.setSecure(true); // 배포 시 HTTPS에서 사용
        return cookie;
    }

    @GetMapping("/user-info")
    public SuccessResponse<Integer> getMemberInfo(@CurrentUser Integer currentMember){
        return SuccessResponse.of(currentMember);
    }

    private static String parseRefreshCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "refresh".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }
        return null;
    }
}
