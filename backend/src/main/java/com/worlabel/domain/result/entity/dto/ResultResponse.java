package com.worlabel.domain.result.entity.dto;

import com.worlabel.domain.result.entity.Optimizer;
import com.worlabel.domain.result.entity.Result;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ResultResponse {
    private Integer id;
    private double precision;
    private double recall;
    private double mAP50;
    private double mAP5095;
    private double fitness;
    private double ratio;
    private double epochs;
    private double batch;
    private double lr0;
    private double lrf;
    private Optimizer optimizer;

    public static ResultResponse fromResult(final Result result) {
        return new ResultResponse(
                result.getId(),
                result.getPrecision(),
                result.getRecall(),
                result.getMAP50(),
                result.getMAP5095(),
                result.getFitness(),
                result.getRatio(),
                result.getEpochs(),
                result.getBatch(),
                result.getLr0(),
                result.getLrf(),
                result.getOptimizer());
    }
}