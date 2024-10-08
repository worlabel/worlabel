package com.worlabel.domain.model.entity.dto;

import com.worlabel.domain.labelcategory.entity.dto.DefaultLabelCategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * AI 응답 DefaultResponse
 */
@Getter
@AllArgsConstructor
public class DefaultResponse {

    private DefaultAiModelResponse defaultAiModelResponse;

    private List<DefaultLabelCategoryResponse> defaultLabelCategoryResponseList;
}
