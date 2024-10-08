package com.worlabel.domain.report.entity.dto;

import com.worlabel.domain.report.entity.Report;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private int modelId;
    private int totalEpochs;
    private int epoch;
    private double boxLoss;
    private double clsLoss;
    private double dflLoss;
    private double fitness;
    private double epochTime;
    private double leftSecond;
    private double segLoss;

    public static ReportResponse from(final Report report) {
        return new ReportResponse(
                report.getAiModel().getId(),
                report.getTotalEpochs(),
                report.getEpoch(),
                report.getBoxLoss(),
                report.getClsLoss(),
                report.getDflLoss(),
                report.getFitness(),
                report.getEpochTime(),
                report.getLeftSecond(),
                report.getSegLoss()
        );
    }

    public static ReportResponse of(final ReportRequest report, final Integer id) {
        return new ReportResponse(
                id,
                report.getTotalEpochs(),
                report.getEpoch(),
                report.getBoxLoss(),
                report.getClsLoss(),
                report.getDflLoss(),
                report.getFitness(),
                report.getEpochTime(),
                report.getLeftSeconds(),
                report.getSegLoss()
        );
    }
}