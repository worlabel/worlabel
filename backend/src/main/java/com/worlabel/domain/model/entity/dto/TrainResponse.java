package com.worlabel.domain.model.entity.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TrainResponse {

    private String modelKey;

    private double precision;

    private double recall;

    private double mAP50;

    private double mAP5095;

    private double fitness;

    private double accuracy;
}
