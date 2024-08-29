package com.worlabel.domain.participant.entity;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Entity
@Table(name = "workspace_participant")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkspaceParticipant extends BaseEntity {

    /**
     * 워크스페이스 프로젝트 참여 PK
     */
    @Id
    @Column(name = "workspace_participant_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 프로젝트
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Workspace workspace;

    /**
     * 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    private WorkspaceParticipant(final Workspace workspace, final Member member) {
        this.workspace = workspace;
        this.member = member;
    }

    public static WorkspaceParticipant of(final Workspace workspace, final Member member) {
        return new WorkspaceParticipant(workspace, member);
    }
}
