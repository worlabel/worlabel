package com.worlabel.domain.participant.repository;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import com.worlabel.domain.workspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkspaceParticipantRepository extends JpaRepository<WorkspaceParticipant, Integer> {

    boolean existsByMemberIdAndWorkspaceId(Integer memberId, Integer workspaceId);

    boolean existsByWorkspaceIdAndMemberId(Integer workspaceId, Integer memberId);

    Optional<WorkspaceParticipant> findByMemberIdAndWorkspace(Integer memberId, Workspace workspace);

    boolean existsByMemberAndWorkspace(Member member, Workspace workspace);
}


