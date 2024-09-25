package com.worlabel.domain.model.entity.dto;

import com.worlabel.domain.model.entity.AiModel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "모델 응답 dto", description = "모델 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AiModelResponse {

    @Schema(description = "모델 ID", example = "1")
    private Integer id;

    @Schema(description = "이름", example = "yolo8")
    private String name;

    @Schema(description = "Default 모델 여부", example = "true")
    private Boolean isDefault;

    public static AiModelResponse of(final AiModel aiModel) {
        return new AiModelResponse(aiModel.getId(), aiModel.getName(), aiModel.getProject() == null);
    }
}
