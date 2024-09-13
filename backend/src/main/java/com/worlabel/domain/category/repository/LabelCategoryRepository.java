package com.worlabel.domain.category.repository;

import com.worlabel.domain.category.entity.LabelCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabelCategoryRepository extends JpaRepository<LabelCategory, Integer> {

    boolean existsByName(String name);

    List<LabelCategory> findAllByProjectId(Integer projectId);
}
