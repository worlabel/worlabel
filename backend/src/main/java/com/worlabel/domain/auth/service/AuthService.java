package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtTokenService jwtTokenService;

    public JwtToken reissue(String refreshToken) throws Exception {
        String username = jwtTokenService.parseUsername(refreshToken);
        if(username == null) throw new CustomException(ErrorCode.INVALID_TOKEN);

        // TODO: 레디스 토큰 검사
        Object redisRefreshToken = null;
        if(Objects.equals(refreshToken, redisRefreshToken)){
            throw new CustomException(ErrorCode.USER_ALREADY_SIGN_OUT);
        }

        return jwtTokenService.generateTokenByRefreshToken(refreshToken);
    }
}
