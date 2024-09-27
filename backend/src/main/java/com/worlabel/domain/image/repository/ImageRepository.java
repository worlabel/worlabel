package com.worlabel.domain.image.repository;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.review.entity.Review;
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
            "join fetch i.folder f " +
            "join fetch f.project p " +
            "where p.id = :projectId " +
            "AND i.status = 'PENDING' OR i.status = 'IN_PROGRESS' ")
    List<Image> findImagesByProjectIdAndPendingOrInProgress(@Param("projectId") Integer projectId);

    @Query("select i from Image i " +
            "join fetch i.folder f " +
            "join fetch f.project p " +
            "where p.id = :projectId " +
            "AND i.status = 'COMPLETED' ")
    List<Image> findImagesByProjectIdAndCompleted(@Param("projectId") Integer projectId);

    Optional<Image> findByIdAndFolderIdAndFolderProjectId(Long imageId, Integer folderId, Integer projectId);

    @Query(value = "SELECT i.* FROM project_image i " +
        "JOIN folder f ON i.folder_id = f.folder_id " +
        "JOIN project p ON f.project_id = p.project_id " +
        "WHERE p.project_id = :projectId " +
        "LIMIT 1", nativeQuery = true)
    Optional<Image> findFirstImageByProjectId(@Param("projectId") Integer projectId);

    @Query("SELECT i FROM Image i " +
            "JOIN FETCH i.folder f " +
            "JOIN FETCH f.project p " +
            "WHERE i.id = :imageId " +
            "AND p.id = :projectId")
    Optional<Image> findByIdAndProjectId(@Param("imageId") Long imageId, @Param("projectId") Integer projectId);

    @Query("SELECT i FROM Image i " +
            "WHERE i.status = 'SAVE' " +
            "AND i.id IN (:imageIds)")
    List<Image> findSaveImageByIds(@Param("imageIds") List<Long> imageIds);
}
