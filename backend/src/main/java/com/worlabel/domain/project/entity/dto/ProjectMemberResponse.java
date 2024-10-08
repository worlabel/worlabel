package com.worlabel.domain.project.entity.dto;

import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "프로젝트 멤버 응답 dto", description = "프로젝트 멤버 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ProjectMemberResponse {

    @Schema(description = "멤버 ID", example = "1")
    private Integer memberId;

    @Schema(description = "멤버 닉네임", example = "javajoha")
    private String nickname;

    @Schema(description = "멤버 프로필 이미지", example = "abc.jpg")
    private String profileImage;

    @Schema(description = "프로젝트 권한", example = "MANAGER")
    private PrivilegeType privilegeType;

    public static ProjectMemberResponse from(final Participant participant) {
        return new ProjectMemberResponse(
            participant.getMember().getId(),
            participant.getMember().getNickname(),
            participant.getMember().getProfileImage(),
            participant.getPrivilege()
        );
    }
}
