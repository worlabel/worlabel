package com.worlabel.domain.labelcategory.repository;

import com.worlabel.domain.labelcategory.entity.LabelCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabelCategoryRepository extends JpaRepository<LabelCategory, Integer> {

    List<LabelCategory> findAllByProjectId(Integer projectId);

    boolean existsByNameAndProjectId(String categoryName, Integer projectId);
}
