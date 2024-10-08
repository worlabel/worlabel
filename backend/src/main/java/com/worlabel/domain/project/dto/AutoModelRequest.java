package com.worlabel.domain.project.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "AutoLabeling 요청 dto", description = "요청시 필요한 모델")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class AutoModelRequest {

    @Schema(description = "모델 ID", example = "1")
    @NotEmpty(message = "모델을 입력하세요.")
    private int modelId;
}
