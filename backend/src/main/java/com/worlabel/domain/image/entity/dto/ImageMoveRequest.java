package com.worlabel.domain.image.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "이미지 이동 요청 DTO", description = "이미지를 다른 폴더로 이동할 때 사용되는 요청 DTO")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ImageMoveRequest {

    @Schema(description = "이동할 폴더 ID, 최상위라면 0", example = "1")
    private Integer moveFolderId;
}
