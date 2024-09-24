package com.worlabel.domain.model.entity.dto;

import com.worlabel.domain.result.entity.Optimizer;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Schema(name = "모델 훈련 요청 dto", description = "모델 훈련 요청 DTO")
public class ModelTrainRequest {

    @Schema(description = "모델 ID", example = "1")
    @NotEmpty(message = "아이디를 입력하세요")
    private Integer modelId;

    @Schema(description = "ratio", example = "Default = 0.8")
    private double ratio;

    @Schema(description = "epochs", example = "Default = 50")
    private int epochs;

    @Schema(description = "batch", example = "Default = -1")
    private int batch;

    @Schema(description = "lr0", example = "Default = 0.01")
    private double lr0;

    @Schema(description = "lrf", example = "Default = 0.01")
    private double lrf;

    @Schema(description = "optimizer", example = "Default = auto")
    private Optimizer optimizer;
}
