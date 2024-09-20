package com.worlabel.domain.member.service;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.entity.dto.MemberResponse;
import com.worlabel.domain.member.entity.dto.MemberDetailResponse;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    /**
     * ID를 기반으로 사용자를 조회한다.
     *
     * @param memberId 사용자 PK
     * @return 사용자 응답 Dto
     */
    public MemberResponse getMemberId(final Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return MemberResponse.of(member);
    }

    public List<MemberDetailResponse> getSearchMember(final Integer memberId, final String keyword) {
        return memberRepository.findAllByKeyword(memberId, keyword.isEmpty() ? null : keyword)
                .stream()
                .map(MemberDetailResponse::of)
                .toList();
    }
}
