package com.worlabel.domain.labelcategory.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Schema(name = "카테고리 요청 DTO", description = "카테고리 생성 및 수정을 위한 요청 DTO")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LabelCategoryRequest {

    @Schema(description = "Model Id", example = "1")
    private Integer modelId;

    @Schema(description = "카테고리 Id 리스트", example = "[0,3,6,8]")
    private List<Integer> labelCategoryList;
}
