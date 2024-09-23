package com.worlabel.domain.image.repository;

import com.worlabel.domain.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query("select i from Image i " +
            "join fetch i.folder f " +
            "join fetch f.project p " +
            "where p.id = :projectId")
    List<Image> findImagesByProjectId(@Param("projectId") Integer projectId);

    @Query("select i from Image i " +
            "where i.folder.project.id = :projectId " +
            "AND i.status = 'PENDING' ")
    List<Image> findImagesByProjectIdAndPending(@Param("projectId") Integer projectId);

    Optional<Image> findByIdAndFolderIdAndFolderProjectId(Long imageId, Integer folderId, Integer projectId);

    @Query("SELECT i FROM Image i " +
            "JOIN FETCH i.folder f " +
            "JOIN FETCH f.project p " +
            "WHERE i.id = :imageId " +
            "AND p.id = :projectId")
    Optional<Image> findByIdAndProjectId(@Param("imageId") Long imageId, @Param("projectId") Integer projectId);
}
