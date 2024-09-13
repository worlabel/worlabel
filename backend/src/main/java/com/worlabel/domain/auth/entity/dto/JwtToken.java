package com.worlabel.domain.auth.entity.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class JwtToken {
    private String accessToken;
    private String refreshToken;

    public static JwtToken of(String accessToken, String refreshToken){
        return new JwtToken(accessToken, refreshToken);
    }
}
