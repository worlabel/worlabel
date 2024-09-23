package com.worlabel.domain.labelcategory.repository;

import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectLabelCategoryRepository extends JpaRepository<ProjectCategory, Integer> {


    @Query("SELECT COUNT(pc) >= 1 FROM ProjectCategory pc " +
            "WHERE pc.project.id = :projectId AND " +
            "pc.labelCategory.name = :categoryName ")
    boolean existsByNameAndProjectId(@Param("categoryName") String categoryName , @Param("projectId") int projectId);

    @Query("SELECT pc FROM ProjectCategory pc " +
            "JOIN FETCH pc.labelCategory " +
            "WHERE pc.project.id = :projectId ")
    List<ProjectCategory> findAllByProjectId(@Param("projectId") Integer projectId);
}
