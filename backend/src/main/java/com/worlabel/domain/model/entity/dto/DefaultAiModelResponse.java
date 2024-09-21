package com.worlabel.domain.model.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * AI서버에서 응답받는 DefaultAiModel
 */
@Getter
@AllArgsConstructor
public class DefaultAiModelResponse {

    private String name;

    private String modelKey;
}
