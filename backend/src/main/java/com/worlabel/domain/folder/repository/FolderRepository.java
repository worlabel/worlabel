package com.worlabel.domain.folder.repository;

import com.worlabel.domain.folder.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Integer> {

    @Query("SELECT f FROM Folder f " +
            "LEFT JOIN FETCH f.imageList i " +
            "WHERE f.project.id = :projectId " +
            "AND f.parent IS NULL ")
    List<Folder> findAllByProjectIdAndParentIsNull(@Param("projectId") Integer projectId);

    @Query("SELECT f FROM Folder f " +
            "LEFT JOIN FETCH f.imageList i " +
            "WHERE f.project.id = :projectId " +
            "AND f.id = :folderId")
    Optional<Folder> findAllByProjectIdAndId(@Param("projectId") Integer projectId, @Param("folderId") Integer folderId);


    boolean existsByIdAndProjectId(Integer folderId, Integer projectId);
}