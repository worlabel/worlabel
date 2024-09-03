package com.worlabel.domain.folder.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.folder.entity.dto.FolderRequest;
import com.worlabel.domain.folder.entity.dto.FolderResponse;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
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
    private final ParticipantRepository participantRepository;

    /**
     * 폴더 생성
     */
    public FolderResponse createFolder(final Integer memberId, final Integer projectId, final FolderRequest folderRequest) {
        checkUnauthorized(memberId, projectId);

        Project project = getProject(projectId);

        Folder parent = null;
        if (folderRequest.getParentId() != 0) {
            parent = getFolder(folderRequest.getParentId());
        }

        Folder folder = Folder.of(folderRequest.getTitle(), parent, project);
        folderRepository.save(folder);

        return FolderResponse.from(folder);
    }

    /**
     * 폴더 조회
     */
    @Transactional(readOnly = true)
    public FolderResponse getFolderById(final Integer memberId, final Integer projectId, final Integer folderId) {
        checkExistParticipant(memberId, projectId);

        // 최상위 폴더
        if (folderId == 0) {
            return FolderResponse.from(folderRepository.findAllByProjectIdAndParentIsNull(projectId));
        } else {
            return FolderResponse.from(getFolder(folderId));
        }
    }

    /**
     * 폴더 수정
     */
    public FolderResponse updateFolder(final Integer memberId, final Integer projectId, final Integer folderId, final FolderRequest updatedFolderRequest) {
        checkUnauthorized(memberId, projectId);
        Folder folder = getFolder(folderId);

        Folder parentFolder = folderRepository.findById(updatedFolderRequest.getParentId())
                .orElse(null);

        folder.updateFolder(updatedFolderRequest.getTitle(), parentFolder);

        return FolderResponse.from(folder);
    }

    /**
     * 폴더 삭제
     */
    public void deleteFolder(final Integer memberId, final Integer projectId, final Integer folderId) {
        checkUnauthorized(memberId, projectId);
        Folder folder = getFolder(folderId);
        folderRepository.delete(folder);
    }

    private Project getProject(final Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    private Folder getFolder(final Integer folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.FOLDER_NOT_FOUND));
    }

    private void checkUnauthorized(final Integer memberId, final Integer projectId) {
        if (participantRepository.doesParticipantUnauthorizedExistByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.FOLDER_UNAUTHORIZED);
        }
    }

    private void checkExistParticipant(final Integer memberId, final Integer projectId) {
        if (!participantRepository.existsByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
    }
}
