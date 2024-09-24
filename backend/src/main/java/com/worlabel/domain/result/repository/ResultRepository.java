package com.worlabel.domain.result.repository;

import com.worlabel.domain.result.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Integer> {

    List<Result> findByAiModelId(Integer modelId);
}
