package com.worlabel.domain.participant.service;

import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
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
     * privilegeType보다 같거나 큰 권한인지 확인
     */
    public void checkPrivilegeUnauthorized(final Integer memberId, final Integer projectId, final PrivilegeType privilegeType) {
        Participant participant = participantRepository.findByMemberIdAndProjectId(memberId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));

        if(!participant.getPrivilege().isAuth(privilegeType)){
            throw new CustomException(ErrorCode.PARTICIPANT_UNAUTHORIZED);
        }
    }
}
