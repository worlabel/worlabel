package com.worlabel.domain.result.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Optimizer {

    AUTO("auto"),
    SGD("SGD"),
    ADAM("Adam"),
    ADAMW("AdamW"),
    NADAM("NAdam"),
    RADAM("RAdam"),
    RMSPROP("RMSProp");

    private final String value;

    Optimizer(String value) {
        this.value = value;
    }

    @JsonCreator
    public static Optimizer from(String value) {
        for (Optimizer status : Optimizer.values()) {
            if (status.getValue().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown optimizer: " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
