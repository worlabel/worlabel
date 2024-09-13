package com.worlabel.domain.category.repository;

import com.worlabel.domain.category.entity.LabelCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<LabelCategory, Integer> {

    boolean existsByName(String name);
}
