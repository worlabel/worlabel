package com.worlabel.domain.participant.service;

import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    /**
     * 프로젝트 수정 권한이 없으면 예외
     * @param memberId 사용자 ID
     * @param projectId 프로젝트 ID
     */
    public void checkEditorUnauthorized(final Integer memberId, final Integer projectId){
        if (participantRepository.doesParticipantUnauthorizedExistByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    /**
     * 프로젝트 View 권한이 없으면 예외
     */
    public void checkViewerUnauthorized(final Integer memberId, final Integer projectId){
        if (participantRepository.doesParticipantUnauthorizedExistByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_UNAUTHORIZED);
        }
    }
}
