package com.worlabel.domain.project.repository;

import com.worlabel.domain.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {

    @Query(value = "SELECT p.* FROM project p " +
            "JOIN participant pt ON p.project_id = pt.project_id " +
            "WHERE p.workspace_id = :workspaceId " +
            "AND pt.member_id = :memberId " +
            "AND (:lastProjectId IS NULL OR p.project_id < :lastProjectId) " +
            "ORDER BY p.project_id DESC " +
            "LIMIT :pageSize",
            nativeQuery = true)
    List<Project> findProjectsByWorkspaceIdAndMemberIdWithPagination(
            @Param("workspaceId") Integer workspaceId,
            @Param("memberId") Integer memberId,
            @Param("lastProjectId") Integer lastProjectId,
            @Param("pageSize") Integer pageSize);
}
