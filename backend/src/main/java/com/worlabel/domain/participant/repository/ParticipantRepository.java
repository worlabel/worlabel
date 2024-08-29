package com.worlabel.domain.participant.repository;

import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {

    boolean existsByMemberIdAndProjectId(Integer memberId, Integer projectId);

    boolean existsByProjectIdAndMemberIdAndPrivilege(Integer projectId, Integer memberId, PrivilegeType privilege);
}


