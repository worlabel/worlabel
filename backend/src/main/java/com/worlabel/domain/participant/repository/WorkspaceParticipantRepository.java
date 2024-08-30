package com.worlabel.domain.participant.repository;

import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceParticipantRepository extends JpaRepository<WorkspaceParticipant, Integer> {

    boolean existsByMemberIdAndWorkspaceId(Integer memberId, Integer workspaceId);

    boolean existsByWorkspaceIdAndMemberId(Integer workspaceId, Integer memberId);
}


