package com.worlabel.domain.member.entity.dto;

import com.worlabel.domain.member.entity.Member;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Schema(name = "멤버 상세 DTO", description = "멤버 상세 응답 DTO")
public class MemberDetailResponse {
    @Schema(description = "ID", example = "1")
    private Integer id;

    @Schema(description = "닉네임", example = "김용수")
    private String nickname;

    @Schema(description = "프로필 이미지")
    private String profileImage;

    @Schema(description = "이메일", example = "xxx@gmail.com")
    private String email;

    public static MemberDetailResponse of(final Member member) {
        return new MemberDetailResponse(member.getId(), member.getNickname(), member.getProfileImage(), member.getEmail());
    }
}
