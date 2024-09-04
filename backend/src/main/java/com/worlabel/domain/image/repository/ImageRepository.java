package com.worlabel.domain.image.repository;

import com.worlabel.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    Optional<Image> findByIdAndFolderId(Long imageId, Integer folderId);

    // TODO: N + 1
    @Query("select i from Image i " +
            "join fetch i.folder f " +
            "join fetch f.project p " +
            "where p.id = :projectId")
    List<Image> findImagesByProjectId(@Param("projectId") Integer projectId);
}
