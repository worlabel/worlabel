package com.worlabel.domain.folder.repository;

import com.worlabel.domain.folder.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Integer> {

    List<Folder> findAllByParentIsNull();

    boolean existsByIdAndProjectId(Integer folderId, Integer projectId);
}