package com.worlabel.domain.result.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Optimizer {

    AUTO("AUTO"),
    SGD("SGD"),
    ADAM("ADAM"),
    ADAMW("ADAMW"),
    NADAM("NADAM"),
    RADAM("RADAM"),
    RMSPROP("RMSPROP");

    private final String value;

    Optimizer(String value) {
        this.value = value;
    }

    @JsonCreator
    public static Optimizer from(String value) {
        for (Optimizer status : Optimizer.values()) {
            if (status.getValue().equals(value.toUpperCase())) {
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
