package com.worlabel.domain.labelcategory.repository;

import com.worlabel.domain.labelcategory.entity.LabelCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LabelCategoryRepository extends JpaRepository<LabelCategory, Integer> {

    @Query("SELECT l FROM LabelCategory l " +
            "WHERE l.aiModel.id = :modelId")
    List<LabelCategory> findAllByModelId(@Param("modelId") Integer modelId);
}
