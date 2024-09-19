package com.worlabel.domain.participant.repository;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import com.worlabel.domain.workspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceParticipantRepository extends JpaRepository<WorkspaceParticipant, Integer> {

    boolean existsByMemberIdAndWorkspaceId(Integer memberId, Integer workspaceId);

    Optional<WorkspaceParticipant> findByMemberIdAndWorkspace(Integer memberId, Workspace workspace);

    boolean existsByMemberAndWorkspace(Member member, Workspace workspace);

    // fetch join을 사용하여 workspaceId에 해당하는 모든 멤버를 함께 가져오는 쿼리
    @Query("SELECT wp FROM WorkspaceParticipant wp JOIN FETCH wp.member WHERE wp.workspace.id = :workspaceId")
    List<WorkspaceParticipant> findAllByWorkspaceIdFetchJoin(@Param("workspaceId") Integer workspaceId);
}


