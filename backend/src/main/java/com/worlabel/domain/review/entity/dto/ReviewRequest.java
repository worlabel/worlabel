package com.worlabel.domain.review.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Schema(name = "리뷰 요청 DTO", description = "리뷰 요청 DTO")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @Schema(description = "리뷰 제목", example = "확인 부탁드립니다.")
    @NotEmpty(message = "내용을 입력하세요.")
    private String title;

    @Schema(description = "리뷰 내용", example = "확인 부탁드립니다.")
    @NotEmpty(message = "내용을 입력하세요.")
    private String content;

    @Schema(description = "리뷰 이미지 id 목록", example = "[1,2,3]")
    @NotNull(message = "이미지를 추가해주세요.")
    private List<Long> imageIds;
}
