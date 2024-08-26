package com.worlabel.domain.participant.entity;

import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 프로젝트 참여 Entity
 */
@Getter
@Entity
@Table(name = "participant")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Participant extends BaseEntity {

    /**
     * 프로젝트 PK
     */
    @Id
    @Column(name = "participant_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 프로젝트 권한
     */
    @Column(name = "participant_privilege",nullable = false)
    @Enumerated(EnumType.STRING)
    private PrivilegeType privilege;
}
