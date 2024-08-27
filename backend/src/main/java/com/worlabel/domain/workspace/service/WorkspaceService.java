package com.worlabel.domain.workspace.service;

import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.entity.dto.WorkspaceRequest;
import com.worlabel.domain.workspace.repository.WorkspaceRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    /**
     * 새로운 워크스페이스 생성
     */
    public Workspace createWorkspace(Integer memberId,  WorkspaceRequest workspace) {

//        return workspaceRepository.save();
    }

    /**
     * 특정 워크스페이스 조회
     */
    public Workspace getWorkspaceById(Integer id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKSPACE_NOT_FOUND, "Workspace not found"));
    }

    /**
     * 전체 워크스페이스 조회
     */
    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    /**
     * 워크스페이스 수정
     */
    public Workspace updateWorkspace(Integer id, Workspace updatedWorkspace) {
        Workspace workspace = getWorkspaceById(id);
//        workspace.setTitle(updatedWorkspace.getTitle());
//        workspace.setDescription(updatedWorkspace.getDescription());
        return workspaceRepository.save(workspace);
    }

    /**
     * 워크스페이스 삭제
     */
    public void deleteWorkspace(Integer id) {
        Workspace workspace = getWorkspaceById(id);
        workspaceRepository.delete(workspace);
    }
}
