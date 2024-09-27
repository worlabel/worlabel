package com.worlabel.domain.report.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    private int totalEpochs;
    private int epoch;
    private double boxLoss;
    private double clsLoss;
    private double dflLoss;
    private double fitness;
    private double epochTime;
    private double leftSeconds;
    private double segLoss;
}