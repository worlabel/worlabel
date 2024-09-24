package com.worlabel.domain.auth.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Schema(name = "Fcm Token 저장 DTO", description = "Token 저장을 위한 DTO")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FcmTokenRequest {
    @Schema(description = "FcmToken", example = "Fcm 서버에서 요청하여 받은 FCM 토큰 형식")
    private String token;
}


