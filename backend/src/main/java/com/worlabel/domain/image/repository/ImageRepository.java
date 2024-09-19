package com.worlabel.domain.image.repository;

import com.worlabel.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query("select i from Image i " +
            "where i.folder.project.id = :projectId")
    List<Image> findImagesByProjectId(@Param("projectId") Integer projectId);

    Optional<Image> findByIdAndFolderIdAndFolderProjectId(Long imageId, Integer folderId, Integer projectId);

    @Query("SELECT count(i) > 0 FROM Image i " +
            "WHERE i.id = :imageId " +
            "AND i.folder.project.id = :projectId ")
    boolean existsByIdAndProjectId(@Param("imageId") Long imageId,@Param("projectId") Integer projectId);
}
