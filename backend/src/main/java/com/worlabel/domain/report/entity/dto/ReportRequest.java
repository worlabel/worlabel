package com.worlabel.domain.report.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {

    @JsonProperty("total_epochs")
    private int totalEpochs;

    private int epoch;

    private double fitness;

    @JsonProperty("epoch_time")
    private double epochTime;

    @JsonProperty("left_seconds")
    private double leftSeconds;

    @JsonProperty("box_loss")
    private double boxLoss;

    @JsonProperty("cls_loss")
    private double clsLoss;

    @JsonProperty("dfl_loss")
    private double dflLoss;

    @JsonProperty("seg_loss")
    private double segLoss;
}