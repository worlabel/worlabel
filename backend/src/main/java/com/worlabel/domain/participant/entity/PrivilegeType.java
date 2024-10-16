package com.worlabel.domain.participant.entity;

import lombok.Getter;

@Getter
public enum PrivilegeType {
    ADMIN(4),
    MANAGER(3),
    EDITOR(2),
    VIEWER(1);

    private final int score;

    // 점수를 부여하는 생성자
    PrivilegeType(final int score) {
        this.score = score;
    }

    // 편집자 이상의 권한이 있는지 확인하는 메서드
    public boolean isEditeAuth() {
        return this.score >= EDITOR.getScore();
    }

    // 매니저 이상의 권한이 있는지 확인하는 메서드
    public boolean isManagerAuth() {
        return this.score >= MANAGER.getScore();
    }

    // 주어진 권한보다 같거나 큰 권한이 있는지 확인하는 메서드
    public boolean isAuth(PrivilegeType type) {
        return this.score >= type.getScore();
    }
}
