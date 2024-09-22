package com.worlabel.domain.image.repository;

import com.worlabel.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    // todo N + 1 발생할듯
    @Query("select i from Image i " +
            "where i.folder.project.id = :projectId")
    List<Image> findImagesByProjectId(@Param("projectId") Integer projectId);

    Optional<Image> findByIdAndFolderIdAndFolderProjectId(Long imageId, Integer folderId, Integer projectId);

    @Query("SELECT i FROM Image i " +
            "WHERE i.id = :imageId " +
            "AND i.folder.project.id = :projectId ")
    Optional<Image> findByIdAndProjectId(@Param("imageId") Long imageId, @Param("projectId") Integer projectId);
}
