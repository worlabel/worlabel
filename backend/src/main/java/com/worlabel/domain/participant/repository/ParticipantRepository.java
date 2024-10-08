package com.worlabel.domain.participant.repository;

import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {

    boolean existsByMemberIdAndProjectId(Integer memberId, Integer projectId);

    boolean existsByProjectIdAndMemberIdAndPrivilege(Integer projectId, Integer memberId, PrivilegeType privilege);

    Optional<Participant> findByMemberIdAndProjectId(Integer memberId, Integer projectId);

    @Query("SELECT p FROM Participant p JOIN FETCH p.member WHERE p.project.id = :projectId")
    List<Participant> findAllByProjectIdWithMember(@Param("projectId") Integer projectId);
}

