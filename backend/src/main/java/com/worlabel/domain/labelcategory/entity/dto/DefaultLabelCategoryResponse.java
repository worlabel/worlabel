package com.worlabel.domain.labelcategory.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * AI서버에서 응답받는 LabelCategory
 */
@Getter
@AllArgsConstructor
public class DefaultLabelCategoryResponse {

    private Integer aiId;

    private String name;
}
