package com.worlabel.domain.auth.controller;

import com.worlabel.domain.auth.entity.dto.FcmTokenRequest;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.entity.dto.AccessTokenResponse;
import com.worlabel.domain.auth.repository.FcmCacheRepository;
import com.worlabel.domain.auth.service.AuthService;
import com.worlabel.domain.auth.service.JwtTokenService;
import com.worlabel.domain.member.entity.dto.MemberResponse;
import com.worlabel.domain.member.service.MemberService;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.FcmService;
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

    private final FcmService fcmService;

    @Value("${auth.refreshTokenExpiry}")
    long refreshExpiry;

    private final FcmCacheRepository fcmCacheRepository;
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

            response.addCookie(createRefreshCookie(newToken.getRefreshToken(), (int) (refreshExpiry / 1000)));
            authService.saveRefreshToken(id, newToken.getRefreshToken(), refreshExpiry);

            return AccessTokenResponse.from(newToken.getAccessToken());
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_TOKEN, e.getMessage());
        }
    }

    @Operation(summary = "로그아웃", description = "사용자의 JWT, FCM Token, 리프레시 토큰을 삭제합니다.")
    @SwaggerApiSuccess(description = "Logout")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_REFRESH_TOKEN, ErrorCode.USER_NOT_FOUND})
    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = parseRefreshCookie(request);
            int memberId = jwtTokenService.parseId(refreshToken);

            // 쿠키에서 리프레시 토큰 삭제
            Cookie deleteCookie = createRefreshCookie(null, 0);
            response.addCookie(deleteCookie);

            authService.deleteRefreshToken(memberId);
            authService.deleteFcmToken(memberId);

        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN, "이미 로그아웃한 사용자입니다.");
        }
    }


    @Operation(summary = "로그인 중인 사용자 정보를 반환", description = "현재 로그인중인 사용자의 정보를 반환합니다.")
    @SwaggerApiSuccess(description = "Return Member Info")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_REFRESH_TOKEN, ErrorCode.USER_NOT_FOUND})
    @GetMapping("/profile")
    public MemberResponse getMemberInfo(@CurrentUser final Integer currentMember) {
        return memberService.getMemberId(currentMember);
    }

    @Operation(summary = "현재 로그인중인 사용자의 FCM 토큰을 입력받음", description = "현재 사용자의 FCM토큰을 저장합니다..")
    @SwaggerApiSuccess(description = "Redis에 FCM 토큰이 저장됨")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_REFRESH_TOKEN, ErrorCode.USER_NOT_FOUND})
    @PostMapping("/fcm")
    public void saveFcmToken(@CurrentUser final Integer memberId, @RequestBody final FcmTokenRequest tokenRequest) {
        authService.saveFcmToken(memberId, tokenRequest.getToken());
    }

    @Operation(summary = "테스트를 위한 알람 전송 API ", description = "알람전송")
    @SwaggerApiSuccess(description = "Redis에 FCM 알람이 전송됨")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN, ErrorCode.INVALID_REFRESH_TOKEN, ErrorCode.USER_NOT_FOUND})
    @PostMapping("/test")
    public void testSend(@CurrentUser final Integer memberId) {
        String token = fcmCacheRepository.getToken(memberId);
        fcmService.testSend(token);
    }

    private static String parseRefreshCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "refreshToken".equals(cookie.getName()))
                    .findFirst()
                    .map(cookie -> cookie.getValue().trim())
                    .orElse(null);
        }
        return null;
    }

    private Cookie createRefreshCookie(String value, int time) {
        Cookie cookie = new Cookie("refreshToken", value);
        cookie.setMaxAge(time);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // 배포 시 HTTPS에서 사용
        return cookie;
    }
}
