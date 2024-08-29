package com.worlabel.domain.project.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProjectType {

    CLASSIFICATION("classification"),
    DETECTION("detection"),
    SEGMENTATION("segmentation");

    private final String value;

    ProjectType(String value) {
        this.value = value;
    }

    @JsonCreator
    public static ProjectType from(String value) {
        for (ProjectType status : ProjectType.values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        return null;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
