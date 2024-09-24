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
    private double ir0;

    @Column(name = "irf", nullable = false)
    private double irf;

    @Column(name = "optimizer", nullable = false)
    @Enumerated(EnumType.STRING)
    private Optimizer optimizer;
}
