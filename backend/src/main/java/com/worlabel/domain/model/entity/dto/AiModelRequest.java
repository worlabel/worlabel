package com.worlabel.domain.model.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "모델 요청 dto", description = "모델 요청 DTO")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class AiModelRequest {

    @Schema(description = "모델 이름", example = "yolo8")
    @NotEmpty(message = "이름을 입력하세요.")
    private String name;
}