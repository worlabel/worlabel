package com.worlabel.domain.labelcategory.repository;

import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectLabelCategoryRepository extends JpaRepository<ProjectCategory, Integer> {

    List<ProjectCategory> findAllByProjectId(Integer projectId);
}
