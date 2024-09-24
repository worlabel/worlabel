package com.worlabel.domain.report.entity.dto;

import com.worlabel.domain.report.entity.Report;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReportResponse {
    private Integer id;
    private Integer totalEpochs;
    private Integer epoch;
    private double boxLoss;
    private double clsLoss;
    private double dflLoss;
    private double fitness;

    public static ReportResponse from(final Report report) {
        return new ReportResponse(
                report.getId(),
                report.getTotalEpochs(),
                report.getEpoch(),
                report.getBoxLoss(),
                report.getClsLoss(),
                report.getDflLoss(),
                report.getFitness());
    }
}