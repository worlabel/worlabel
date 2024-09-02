package com.worlabel.domain.member.entity.dto;

import com.worlabel.domain.member.entity.Member;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Schema(name = "멤버 응답 DTO", description = "사용자에 대한 응답 DTO")
public class MemberResponse {
    @Schema(description = "사용자 ID", example = "1")
    private Integer id;

    @Schema(description = "사용자 닉네임", example = "김용수")
    private String nickname;

    @Schema(description = "프로필 이미지")
    private String profileImage;

    public static MemberResponse of(final Member member) {
        return new MemberResponse(member.getId(), member.getNickname(), member.getProfileImage());
    }
}
