package com.worlabel.domain.model.entity.dto;

import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.project.entity.ProjectType;
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

    @Schema(description = "모델 학습 여부", example = "true")
    private Boolean isTrain;

    @Schema(description = "모델 종류", example = "classification")
    private ProjectType projectType;

    public static AiModelResponse of(final AiModel aiModel, final int progressModelId, final ProjectType projectType) {
        return new AiModelResponse(aiModel.getId(), aiModel.getName(), aiModel.getProject() == null, aiModel.getId() == progressModelId, projectType);
    }
}
