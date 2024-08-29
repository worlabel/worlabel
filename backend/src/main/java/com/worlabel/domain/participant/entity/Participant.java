package com.worlabel.domain.participant.entity;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * 프로젝트 참여 Entity
 */
@Getter
@Entity
@Table(name = "participant")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Participant extends BaseEntity {

    /**
     * 프로젝트 참여 PK
     */
    @Id
    @Column(name = "participant_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 프로젝트
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    /**
     * 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    /**
     * 프로젝트 권한
     */
    @Column(name = "participant_privilege", nullable = false)
    @Enumerated(EnumType.STRING)
    private PrivilegeType privilege;

    private Participant(final Project project, final Member member, final PrivilegeType privilege) {
        this.project = project;
        this.member = member;
        this.privilege = privilege;
    }

    public static Participant of(final Project project, final Member member, final PrivilegeType privilege) {
        return new Participant(project, member, privilege);
    }
}
