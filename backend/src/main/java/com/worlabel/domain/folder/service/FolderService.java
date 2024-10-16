package com.worlabel.domain.folder.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.folder.entity.dto.FolderRequest;
import com.worlabel.domain.folder.entity.dto.FolderResponse;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FolderService {

    private final FolderRepository folderRepository;
    private final ProjectRepository projectRepository;

    /**
     * 폴더 생성
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public FolderResponse createFolder(final Integer projectId, final FolderRequest folderRequest) {
        Project project = getProject(projectId);

        Folder parent = null;
        if (folderRequest.getParentId() != 0) {
            parent = getFolder(folderRequest.getParentId(), projectId);
        }

        Folder folder = Folder.of(folderRequest.getTitle(), parent, project);
        folderRepository.save(folder);

        return FolderResponse.from(folder);
    }

    /**
     * 폴더 조회
     */
    @Transactional(readOnly = true)
    @CheckPrivilege(PrivilegeType.VIEWER)
    public FolderResponse getFolderById(final Integer projectId, final Integer folderId) {
        // 최상위 폴더
        if (folderId == 0) {
            return FolderResponse.from(folderRepository.findAllByProjectIdAndParentIsNull(projectId));
        } else {
            return FolderResponse.from(getFolder(folderId, projectId));
        }
    }

    /**
     * 폴더 수정
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public FolderResponse updateFolder(final Integer projectId, final Integer folderId, final FolderRequest updatedFolderRequest) {
        Folder folder = getFolder(folderId, projectId);

        Folder parentFolder = folderRepository.findById(updatedFolderRequest.getParentId())
                .orElse(null);

        folder.updateFolder(updatedFolderRequest.getTitle(), parentFolder);

        return FolderResponse.from(folder);
    }

    /**
     * 폴더 삭제
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void deleteFolder(final Integer projectId, final Integer folderId) {
        Folder folder = getFolder(folderId, projectId);
        folderRepository.delete(folder);
    }

    /**
     *  리뷰 목록만 조회
     */
    @CheckPrivilege(PrivilegeType.VIEWER)
    public FolderResponse getFolderByIdWithNeedReview(final Integer projectId, final Integer folderId) {
        // 최상위 폴더
        if (folderId == 0) {
            return FolderResponse.from(folderRepository.findAllByProjectIdAndParentIsNull(projectId));
        } else {
            return FolderResponse.fromWithNeedReview(getFolder(folderId, projectId));
        }
    }

    private Project getProject(final Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    private Folder getFolder(final Integer folderId, final Integer projectId) {
        return folderRepository.findAllByProjectIdAndId(projectId, folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }
}
