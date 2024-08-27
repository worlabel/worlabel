package com.worlabel.domain.auth.dto;

import com.worlabel.domain.member.entity.Member;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class AuthMemberDto {
    private int id;
    private String email;
    private String role;

    public static AuthMemberDto of(Member member) {
        AuthMemberDto authMemberDto = new AuthMemberDto();
        authMemberDto.id = member.getId();
        authMemberDto.email = member.getEmail();
        authMemberDto.role = member.getRole().toString();

        return authMemberDto;
    }
}
