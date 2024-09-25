package com.worlabel.domain.result.entity;

import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "result")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Result extends BaseEntity {

    @Id
    @Column(name = "result_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 소속된 모델
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private AiModel aiModel;

    @Column(name = "precision", nullable = false)
    private double precision;

    @Column(name = "recall", nullable = false)
    private double recall;

    @Column(name = "mAP50", nullable = false)
    private double mAP50;

    @Column(name = "mAP50-95", nullable = false)
    private double mAP5095;

    @Column(name = "fitness", nullable = false)
    private double fitness;

    @Column(name = "ratio", nullable = false)
    private double ratio;

    @Column(name = "epochs", nullable = false)
    private double epochs;

    @Column(name = "batch", nullable = false)
    private double batch;

    @Column(name = "ir0", nullable = false)
    private double lr0;

    @Column(name = "irf", nullable = false)
    private double lrf;

    @Column(name = "optimizer", nullable = false)
    @Enumerated(EnumType.STRING)
    private Optimizer optimizer;

    public Result(final AiModel aiModel,
                  final double precision,
                  final double recall,
                  final double mAP50,
                  final double mAP5095,
                  final double fitness,
                  final double ratio,
                  final double epochs,
                  final double batch,
                  final double lr0,
                  final double lrf,
                  final Optimizer optimizer) {
        this.aiModel = aiModel;
        this.precision = precision;
        this.recall = recall;
        this.mAP50 = mAP50;
        this.mAP5095 = mAP5095;
        this.fitness = fitness;
        this.ratio = ratio;
        this.epochs = epochs;
        this.batch = batch;
        this.lr0 = lr0;
        this.lrf = lrf;
        this.optimizer = optimizer;
    }

    public static Result of(final AiModel aiModel,
                            final double precision,
                            final double recall,
                            final double mAP50,
                            final double mAP5095,
                            final double fitness,
                            final double ratio,
                            final double epochs,
                            final double batch,
                            final double lr0,
                            final double lrf,
                            final Optimizer optimizer) {
        return new Result(aiModel, precision, recall, mAP50, mAP5095, fitness, ratio, epochs, batch, lr0, lrf, optimizer);
    }
}
