package com.worlabel.domain.image.repository;

import com.worlabel.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Integer> {

    Optional<Image> findByIdAndFolderId(Integer imageId, Integer folderId);
}
