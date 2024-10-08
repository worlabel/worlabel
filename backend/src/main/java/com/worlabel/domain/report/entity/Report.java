package com.worlabel.domain.report.entity;

import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "report")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Report extends BaseEntity {

    @Id
    @Column(name = "report_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 소속된 모델
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private AiModel aiModel;

    /**
     * 현재 에포크
     */
    @Column(name = "epoch", nullable = false)
    private Integer epoch;

    /**
     * 전체 에포크
     */
    @Column(name = "total_epochs", nullable = false)
    private Integer totalEpochs;


    @Column(name = "box_loss", nullable = false)
    private double boxLoss;

    @Column(name = "cls_loss", nullable = false)
    private double clsLoss;

    @Column(name = "dfl_loss", nullable = false)
    private double dflLoss;

    @Column(name = "fitness", nullable = false)
    private double fitness;

    @Column(name = "epoch_time", nullable = false)
    private double epochTime;

    @Column(name = "left_second", nullable = false)
    private double leftSecond;

    @Column(name = "seg_loss", nullable = false)
    private double segLoss;

    private Report(final AiModel aiModel,
                   final Integer epoch,
                   final Integer totalEpochs,
                   final double boxLoss,
                   final double clsLoss,
                   final double dflLoss,
                   final double fitness,
                   final double epochTime,
                   final double leftSecond,
                   final double segLoss) {
        this.aiModel = aiModel;
        this.epoch = epoch;
        this.totalEpochs = totalEpochs;
        this.boxLoss = boxLoss;
        this.clsLoss = clsLoss;
        this.dflLoss = dflLoss;
        this.fitness = fitness;
        this.epochTime = epochTime;
        this.leftSecond = leftSecond;
        this.segLoss = segLoss;
    }

    public static Report of(final AiModel aiModel,
                            final Integer epoch,
                            final Integer totalEpochs,
                            final double boxLoss,
                            final double clsLoss,
                            final double dflLoss,
                            final double fitness,
                            final double epochTime,
                            final double leftSecond,
                            final double segLoss) {
        return new Report(aiModel, epoch, totalEpochs, boxLoss, clsLoss, dflLoss, fitness, epochTime, leftSecond, segLoss);
    }
}
