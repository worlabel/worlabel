package com.worlabel.domain.labelcategory.repository;

import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectLabelCategoryRepository extends JpaRepository<ProjectCategory, Integer> {

    boolean existByName(String categoryName);
}
