package com.worlabel.domain.review.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.worlabel.domain.image.entity.LabelStatus;

public enum ReviewStatus {

    REQUESTED,
    APPROVED,
    REJECTED;

    // 입력 값을 enum 값과 일치시키기 위해 대소문자 구분 없이 변환
    @JsonCreator
    public static LabelStatus from(final String value) {
        return LabelStatus.valueOf(value.toUpperCase()); // 입력된 값을 대문자로 변환
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
