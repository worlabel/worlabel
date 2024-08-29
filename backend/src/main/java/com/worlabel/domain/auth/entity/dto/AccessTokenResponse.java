package com.worlabel.domain.auth.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "리프레시 토큰 응답 dto", description = "리프레시 토큰 응답 dto")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AccessTokenResponse {

    @Schema(description = "액세스 토큰", example = "")
    private String accessToken;

    public static AccessTokenResponse from(String accessToken) {
        return new AccessTokenResponse(accessToken);
    }
}
