package com.worlabel.domain.auth.controller;

import com.worlabel.domain.auth.entity.dto.FcmTokenRequest;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.entity.dto.AccessTokenResponse;
import com.worlabel.domain.auth.service.AuthService;
import com.worlabel.domain.auth.service.JwtTokenService;
import com.worlabel.domain.member.entity.dto.MemberResponse;
import com.worlabel.domain.member.service.MemberService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;


@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "인증/인가 관련 API")
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${auth.refreshTokenExpiry}")
    long refreshExpiry;

    private final JwtTokenService jwtTokenService;
    private final MemberService memberService;
    private final AuthService authService;

    @Operation(summary = "JWT 토큰 재발급", description = "Refresh Token을 확인하여 JWT 토큰 재발급")
    @SwaggerApiSuccess(description = "Return Access Token")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_REFRESH_TOKEN})
    @PostMapping("/reissue")
    public AccessTokenResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        log.debug("reissue request");
        String refresh = parseRefreshCookie(request);
        try {
            JwtToken newToken = authService.reissue(refresh);
            int id = jwtTokenService.parseId(newToken.getAccessToken());

            response.addCookie(createCookie(newToken.getRefreshToken()));
            authService.saveRefreshToken(id, newToken.getRefreshToken(),refreshExpiry);

            return AccessTokenResponse.from(newToken.getAccessToken());
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_TOKEN, e.getMessage());
        }
    }

    @Operation(summary = "로그인 중인 사용자 정보를 반환", description = "현재 로그인중인 사용자의 정보를 반환합니다.")
    @SwaggerApiSuccess(description = "Return Member Info")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_REFRESH_TOKEN, ErrorCode.USER_NOT_FOUND})
    @GetMapping("/profile")
    public MemberResponse getMemberInfo(@CurrentUser Integer currentMember){
        return memberService.getMemberId(currentMember);
    }

    @Operation(summary = "현재 로그인중인 사용자의 FCM 토큰을 입력받음", description = "현재 사용자의 FCM토큰을 저장합니다..")
    @SwaggerApiSuccess(description = "Redis에 FCM 토큰이 저장됨")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_REFRESH_TOKEN, ErrorCode.USER_NOT_FOUND})
    @PostMapping("/fcm")
    public void saveFcmToken(@CurrentUser Integer currentMember, @RequestBody final FcmTokenRequest tokenRequest){

    }

    private static String parseRefreshCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .findFirst()
                    .map(cookie -> cookie.getValue().trim())
                    .orElse(null);
        }
        return null;
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
