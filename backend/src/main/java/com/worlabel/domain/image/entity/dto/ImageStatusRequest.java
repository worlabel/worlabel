package com.worlabel.domain.image.entity.dto;

import com.worlabel.domain.image.entity.LabelStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "이미지 상태변경 요청 DTO", description = "이미지의 상태를 변경할때 사용되는 요청 DTO")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ImageStatusRequest {

    @Schema(description = "상태", example = "NEED_REVIEW")
    @NotNull(message = "상태를 입력하세요.")
    private LabelStatus labelStatus;
}