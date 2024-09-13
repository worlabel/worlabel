package com.worlabel.domain.auth.entity.dto;

import com.worlabel.domain.member.entity.Member;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthMemberDto {
    private int id;
    private String email;
    private String role;

    public static AuthMemberDto from(Member member) {
        return new AuthMemberDto(member.getId(), member.getEmail(), member.getRole().toString());
    }

    public static AuthMemberDto of(int id, String email, String role) {
        return new AuthMemberDto(id, email, role);
    }
}
