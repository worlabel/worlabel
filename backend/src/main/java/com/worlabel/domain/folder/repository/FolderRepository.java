package com.worlabel.domain.folder.repository;

import com.worlabel.domain.folder.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Integer> {

    List<Folder> findAllByProjectIdAndParentIsNull(Integer projectId);

    Optional<Folder> findAllByProjectIdAndId(Integer projectId, Integer folderId);

    boolean existsByIdAndProjectId(Integer folderId, Integer projectId);
}