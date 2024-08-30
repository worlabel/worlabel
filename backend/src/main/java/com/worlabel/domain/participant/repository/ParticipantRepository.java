package com.worlabel.domain.participant.repository;

import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {

    boolean existsByMemberIdAndProjectId(Integer memberId, Integer projectId);

    boolean existsByProjectIdAndMemberIdAndPrivilege(Integer projectId, Integer memberId, PrivilegeType privilege);

    @Query("SELECT NOT EXISTS (" +
            "SELECT 1 FROM Participant p " +
            "WHERE p.project.id = :projectId " +
            "AND p.member.id = :memberId " +
            "AND (p.privilege = 'ADMIN' OR p.privilege = 'EDITOR'))")
    boolean doesParticipantUnauthorizedExistByMemberIdAndProjectId(
            @Param("memberId") Integer memberId,
            @Param("projectId") Integer projectId);

    Participant findByMemberIdAndProjectId(Integer memberId, Integer projectId);
}


