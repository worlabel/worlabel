package com.worlabel.domain.model.repository;

import com.worlabel.domain.model.entity.AiModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AiModelRepository extends JpaRepository<AiModel, Integer> {

    @Query("SELECT a FROM AiModel a " +
            "WHERE a.project IS NULL " +
            "OR a.project.id = :projectId " +
            "ORDER BY a.id DESC ")
    List<AiModel> findAllByProjectId(@Param("projectId") Integer projectId);

    @Query("SELECT a FROM AiModel a " +
            "WHERE a.project IS NOT NULL AND a.id = :modelId")
    Optional<AiModel> findCustomModelById(@Param("modelId") int modelId);

    List<AiModel> findAllByModelKeyIn(List<String> allModelKeys);
}
