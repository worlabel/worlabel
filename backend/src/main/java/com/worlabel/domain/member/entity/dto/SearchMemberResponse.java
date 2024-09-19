package com.worlabel.domain.member.entity.dto;

import com.worlabel.domain.member.entity.Member;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Schema(name = "멤버 검색 DTO", description = "이메일 검색에 대한 응답 DTO")
public class SearchMemberResponse {
    @Schema(description = "ID", example = "1")
    private Integer id;

    @Schema(description = "닉네임", example = "김용수")
    private String nickname;

    @Schema(description = "프로필 이미지")
    private String profileImage;

    @Schema(description = "이메일", example = "xxx@gmail.com")
    private String email;

    public static SearchMemberResponse of(final Member member) {
        return new SearchMemberResponse(member.getId(), member.getNickname(), member.getProfileImage(), member.getEmail());
    }
}
