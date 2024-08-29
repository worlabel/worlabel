package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.repository.AuthCacheRepository;
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
    private final AuthCacheRepository authCacheRepository;

    public JwtToken reissue(String refreshToken) throws Exception {
        int id = jwtTokenService.parseId(refreshToken);
        Object redisRefreshToken = authCacheRepository.find(id);
        log.debug("{} == {} ",redisRefreshToken,refreshToken);
        if(!Objects.equals(refreshToken, redisRefreshToken)){
            throw new CustomException(ErrorCode.USER_ALREADY_SIGN_OUT);
        }

        return jwtTokenService.generateTokenByRefreshToken(refreshToken);
    }
}
