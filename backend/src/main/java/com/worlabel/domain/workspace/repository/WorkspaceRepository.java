package com.worlabel.domain.workspace.repository;

import com.worlabel.domain.workspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Integer> {

    Optional<Workspace> findByMemberIdAndId(Integer memberId, Integer workspaceId);

    @Query(value = "SELECT w.* FROM workspace w " +
            "JOIN workspace_participant wp ON w.workspace_id = wp.workspace_id " +
            "WHERE wp.member_id = :memberId " +
            "AND (:lastWorkspaceId IS NULL OR w.workspace_id < :lastWorkspaceId) " +
            "ORDER BY w.workspace_id DESC " +
            "LIMIT :pageSize", nativeQuery = true)
    List<Workspace> findWorkspacesByMemberIdWithPagination(
            @Param("memberId") Integer memberId,
            @Param("lastWorkspaceId") Integer lastWorkspaceId,
            @Param("pageSize") Integer pageSize);
}
