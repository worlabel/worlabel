package com.worlabel.domain.participant.entity.dto;

import com.worlabel.domain.participant.entity.PrivilegeType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "프로젝트 멤버 요청 dto", description = "프로젝트 멤버 요청 DTO")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class ParticipantRequest {

    @Schema(description = "멤버 ID", example = "1")
    @NotEmpty(message = "추가할 멤버 ID를 입력하세요.")
    private Integer memberId;

    @Schema(description = "권한", example = "ADMIN")
    @NotNull(message = "권한을 입력하세요.")
    private PrivilegeType privilegeType;
}
