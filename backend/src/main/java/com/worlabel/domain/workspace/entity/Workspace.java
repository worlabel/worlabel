package com.worlabel.domain.workspace.entity;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.global.common.BaseEntity;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Entity
@Table(name = "workspace")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Workspace extends BaseEntity {

    /**
     * 워크 스페이스 PK
     */
    @Id
    @Column(name = "workspace_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 만든 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    /**
     * 워크 스페이스 제목
     */
    @Column(name = "title", nullable = false, length = 50)
    private String title;

    /**
     * 워크 스페이스 설명
     */
    @Column(name = "description", nullable = false, length = 255)
    private String description;

    private Workspace(final Member member, final String title, final String description) {
        validateInputs(member, title, description);
        this.member = member;
        this.title = title;
        this.description = description;
    }

    public static Workspace of(final Member member, final String title, final String description) {
        return new Workspace(member, title, description);
    }

    public void updateWorkspace(final String title, final String description) {
        validateInputs(member, title, description);
        this.title = title;
        this.description = description;
    }

    private void validateInputs(final Member member, final String title, final String description) {
        if (member == null || title.isBlank() || description.isBlank()) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
    }
}

