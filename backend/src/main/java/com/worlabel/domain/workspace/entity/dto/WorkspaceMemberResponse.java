package com.worlabel.domain.workspace.entity.dto;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "워크스페이스 멤버 응답 dto", description = "워크스페이스 멤버 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class WorkspaceMemberResponse {

    @Schema(description = "멤버 ID", example = "1")
    private Integer memberId;

    @Schema(description = "멤버 닉네임", example = "javajoha")
    private String nickname;

    @Schema(description = "멤버 프로필 이미지", example = "abc.jpg")
    private String profileImage;


    public static WorkspaceMemberResponse from(final WorkspaceParticipant workspaceParticipant) {
        Member member = workspaceParticipant.getMember();
        return new WorkspaceMemberResponse(member.getId(), member.getNickname(), member.getEmail());
    }
}
