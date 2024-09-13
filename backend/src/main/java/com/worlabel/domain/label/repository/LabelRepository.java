package com.worlabel.domain.label.repository;

import com.worlabel.domain.label.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LabelRepository extends JpaRepository<Label, Long> {

    Optional<Label> findByImageId(Long imageId);

    boolean existsByImageId(Long imageId);
}
