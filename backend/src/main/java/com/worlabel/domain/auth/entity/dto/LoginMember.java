package com.worlabel.domain.auth.entity.dto;

import lombok.Getter;

@Getter
public class LoginMember {
    private int id;
    private String email;

    public static LoginMember of(int id, String email) {
        LoginMember member = new LoginMember();
        member.id = id;
        member.email = email;
        return member;
    }
}
