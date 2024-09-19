package com.worlabel.domain.member.controller;

import com.worlabel.domain.member.entity.dto.MemberResponse;
import com.worlabel.domain.member.entity.dto.SearchMemberResponse;
import com.worlabel.domain.member.service.MemberService;
import com.worlabel.domain.workspace.entity.dto.WorkspaceResponse;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "멤버 관련 API")
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "이메일 기반 사용자 조회", description = "이메일 기반으로 사용자를 조회합니다.")
    @SwaggerApiSuccess(description = "keyword가 포함된 사용자를 검색합니다.")
    @SwaggerApiError({ErrorCode.BAD_REQUEST, ErrorCode.NOT_AUTHOR, ErrorCode.SERVER_ERROR})
    @GetMapping
    public List<SearchMemberResponse> getWorkspace(
            @CurrentUser final Integer memberId,
            @Param("keyword") final String keyword
    ) {
        return memberService.getSearchMember(memberId, keyword);
    }
}
