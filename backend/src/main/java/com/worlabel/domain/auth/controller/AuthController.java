package com.worlabel.domain.auth.controller;

import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.entity.dto.AccessTokenResponse;
import com.worlabel.domain.auth.service.AuthService;
import com.worlabel.domain.auth.service.JwtTokenService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.response.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "인증/인가 관련 API")
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${auth.refreshTokenExpiry}")
    long refreshExpiry;

    private final AuthService authService;
    private final JwtTokenService jwtTokenService;

    @Operation(summary = "JWT 토큰 재발급", description = "Refresh Token을 확인하여 JWT 토큰 재발급")
    @SwaggerApiSuccess(description = "Return Access Token")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.USER_ALREADY_SIGN_OUT, ErrorCode.REFRESH_TOKEN_EXPIRED, ErrorCode.INVALID_REFRESH_TOKEN})
    @PostMapping("/reissue")
    public SuccessResponse<AccessTokenResponse> reissue(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        log.debug("reissue request");
        String refresh = parseRefreshCookie(request);
        try {
            JwtToken newToken = authService.reissue(refresh);
            int id = jwtTokenService.parseId(newToken.getAccessToken());

            response.addCookie(createCookie(newToken.getRefreshToken()));
            authService.saveRefreshToken(id, newToken.getRefreshToken(),refreshExpiry);

            return SuccessResponse.of(AccessTokenResponse.from(newToken.getAccessToken()));
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_TOKEN, e.getMessage());
        }
    }

    // TODO: Member 완성 후 구현
    @Operation(summary = "로그인 중인 사용자 정보를 반환", description = "현재 로그인중인 사용자의 정보를 반환합니다.")
    @SwaggerApiSuccess(description = "Return Member Info")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.USER_ALREADY_SIGN_OUT, ErrorCode.REFRESH_TOKEN_EXPIRED, ErrorCode.INVALID_REFRESH_TOKEN})
    @GetMapping("/user-info")
    public SuccessResponse<Integer> getMemberInfo(@CurrentUser Integer currentMember){
        return SuccessResponse.of(currentMember);
    }

    private static String parseRefreshCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .map(String::trim)
                    .orElse(null);
        }
        return null;
    }

    private Cookie createCookie(String value) {
        Cookie cookie = new Cookie("refreshToken", value);
        cookie.setMaxAge((int) (refreshExpiry / 1000));
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        // cookie.setSecure(true); // 배포 시 HTTPS에서 사용
        return cookie;
    }
}
