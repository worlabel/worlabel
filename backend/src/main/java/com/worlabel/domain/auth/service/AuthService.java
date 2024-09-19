package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.domain.auth.repository.AuthCacheRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final JwtTokenService jwtTokenService;
    private final AuthCacheRepository authCacheRepository;

    /**
     * JWT 토큰 재발급
     */
    public JwtToken reissue(String refreshToken) throws Exception {
        int id = jwtTokenService.parseId(refreshToken);
        String redisRefreshToken = authCacheRepository.find(id);
        if(!refreshToken.equals(redisRefreshToken)){
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        return jwtTokenService.generateTokenByRefreshToken(refreshToken);
    }

    /**
     * 레디에 리프레시 토큰 저장
     */
    public void saveRefreshToken(int id, String refreshToken,Long expiredTime) {
        authCacheRepository.save(id, refreshToken, expiredTime);
    }
}
