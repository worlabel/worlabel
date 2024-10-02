package com.worlabel.domain.project.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.worlabel.domain.alarm.entity.Alarm;
import com.worlabel.domain.alarm.service.AlarmService;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.labelcategory.entity.ProjectCategory;
import com.worlabel.domain.labelcategory.repository.ProjectLabelCategoryRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.model.repository.AiModelRepository;
import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import com.worlabel.domain.participant.entity.dto.ParticipantRequest;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.participant.repository.WorkspaceParticipantRepository;
import com.worlabel.domain.progress.service.ProgressService;
import com.worlabel.domain.project.dto.AiDto.AutoLabelingImageRequest;
import com.worlabel.domain.project.dto.AiDto.AutoLabelingRequest;
import com.worlabel.domain.project.dto.AiDto.AutoLabelingResult;
import com.worlabel.domain.project.dto.AutoModelRequest;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.dto.*;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.repository.WorkspaceRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.AiRequestService;
import com.worlabel.global.service.FcmService;
import com.worlabel.global.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final WorkspaceParticipantRepository workspaceParticipantRepository;
    private final ParticipantRepository participantRepository;
    private final WorkspaceRepository workspaceRepository;
    private final AiModelRepository aiModelRepository;
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final ProgressService progressService;
    private final ProjectLabelCategoryRepository projectLabelCategoryRepository;
    private final S3UploadService s3UploadService;
    private final ImageRepository imageRepository;
    private final AiRequestService aiService;

    private final Gson gson;
    private final FcmService fcmService;
    private final AlarmService alarmService;

    @Transactional
    public ProjectResponse createProject(final Integer memberId, final Integer workspaceId, final ProjectWithCategoryRequest projectRequest) {
        Workspace workspace = getWorkspace(memberId, workspaceId);
        Member member = getMember(memberId);

        Project project = Project.of(projectRequest.getTitle(), workspace, projectRequest.getProjectType());
        Participant participant = Participant.of(project, member, PrivilegeType.ADMIN);

        projectRepository.save(project);

        for (String labelName : projectRequest.getCategories()) {
            projectLabelCategoryRepository.save(ProjectCategory.of(labelName, project));
        }

        participantRepository.save(participant);

        return ProjectResponse.from(project);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public ProjectResponse getProjectById(final Integer projectId) {
        Project project = getProject(projectId);
        return ProjectResponse.from(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectWithThumbnailResponse> getProjectsByWorkspaceId(final Integer workspaceId, final Integer memberId, final Integer lastProjectId, final Integer pageSize) {
        return projectRepository.findProjectsByWorkspaceIdAndMemberIdWithPagination(workspaceId, memberId, lastProjectId, pageSize).stream()
                .map(project -> ProjectWithThumbnailResponse.from(project, getFirstImageWithProject(project)))
                .toList();
    }

    @Transactional
    @CheckPrivilege(PrivilegeType.ADMIN)
    public ProjectResponse updateProject(final Integer projectId, final ProjectRequest projectRequest) {
        Project project = getProject(projectId);
        project.updateProject(projectRequest.getTitle(), projectRequest.getProjectType());

        return ProjectResponse.from(project);
    }

    @Transactional
    @CheckPrivilege(PrivilegeType.ADMIN)
    public void deleteProject(final Integer projectId) {
        projectRepository.deleteById(projectId);
    }

    @CheckPrivilege(PrivilegeType.VIEWER)
    public List<ProjectMemberResponse> getProjectMember(final Integer projectId) {
        List<Participant> participants = participantRepository.findAllByProjectIdWithMember(projectId);

        return participants.stream()
                .map(ProjectMemberResponse::from)
                .toList();
    }

    @Transactional
    @CheckPrivilege(PrivilegeType.ADMIN)
    public void addProjectMember(final Integer memberId, final Integer projectId, final ParticipantRequest participantRequest) {
        checkSelfParticipant(memberId, participantRequest.getMemberId());

        if (participantRepository.existsByMemberIdAndProjectId(participantRequest.getMemberId(), projectId)) {
            throw new CustomException(ErrorCode.EARLY_ADD_MEMBER);
        }

        Project project = getProject(projectId);
        Member member = getMember(participantRequest.getMemberId());
        Participant participant = Participant.of(project, member, participantRequest.getPrivilegeType());

        if (!workspaceParticipantRepository.existsByMemberAndWorkspace(member, project.getWorkspace())) {
            workspaceParticipantRepository.save(WorkspaceParticipant.of(project.getWorkspace(), member));
        }

        participantRepository.save(participant);
    }

    @CheckPrivilege(PrivilegeType.ADMIN)
    public void changeProjectMember(final Integer projectId, final ParticipantRequest participantRequest) {
        checkNotAdminParticipant(participantRequest.getMemberId(), projectId);

        Participant participant = participantRepository.findByMemberIdAndProjectId(participantRequest.getMemberId(), projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));
        participant.updatePrivilege(participantRequest.getPrivilegeType());
    }

    @Transactional
    @CheckPrivilege(PrivilegeType.ADMIN)
    public void removeProjectMember(final Integer projectId, final Integer removeMemberId) {
        checkNotAdminParticipant(removeMemberId, projectId);

        Participant participant = participantRepository.findByMemberIdAndProjectId(removeMemberId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));

        participantRepository.delete(participant);
    }

    /**
     * 프로젝트별 오토 레이블링
     */
    @Transactional
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void autoLabeling(final Integer memberId, final Integer projectId, final AutoModelRequest request) {
        progressService.predictProgressCheck(projectId);

        try {
            progressService.registerPredictProgress(projectId);
            Project project = getProject(projectId);
            String endPoint = project.getProjectType().getValue() + "/predict";

            List<Image> imageList = imageRepository.findImagesByProjectIdAndPendingOrInProgress(projectId);
            if (imageList.isEmpty()) {
                throw new CustomException(ErrorCode.DATA_NOT_FOUND);
            }

            List<AutoLabelingImageRequest> imageRequestList = imageList.stream()
                    .map(AutoLabelingImageRequest::of)
                    .toList();

            HashMap<String, Integer> labelMap = getLabelMap(project);

            AiModel aiModel = getAiModel(request);
            AutoLabelingRequest autoLabelingRequest = AutoLabelingRequest.of(projectId, aiModel.getModelKey(), labelMap, imageRequestList);

            log.debug("요청 이미지 개수 :{}", imageRequestList.size());

            List<AutoLabelingResult> list = aiService.postRequest(endPoint, autoLabelingRequest, List.class, this::converter);

            saveAutoLabelList(list);
            log.debug("응답 이미지 개수 :{}", list.size());

            alarmService.save(memberId, Alarm.AlarmType.PREDICT);
        } finally {
            progressService.removePredictProgress(projectId);
        }

    }

    @Transactional
    public void saveAutoLabelList(final List<AutoLabelingResult> resultList) {
        for (AutoLabelingResult result : resultList) {
            Image image = getImage(result.getImageId());
            if (image.getStatus() == LabelStatus.SAVE || image.getStatus() == LabelStatus.REVIEW_REQUEST || image.getStatus() == LabelStatus.REVIEW_REJECT) continue;
            String dataPath = image.getDataPath();
            s3UploadService.uploadJson(result.getData(), dataPath);
            image.updateStatus(LabelStatus.IN_PROGRESS);
            imageRepository.save(image);
        }
    }

    /**
     * 데이터 변환
     */
    private List<AutoLabelingResult> converter(String data) {
        try {
            log.debug("data :{}", data);
            // Gson에서 리스트 형태로 변환할 타입을 지정
            Type listType = new TypeToken<List<AutoLabelingResult>>() {
            }.getType();
            // JSON 배열을 List<AutoLabelingResult>로 변환
            return gson.fromJson(data, listType);
        } catch (JsonSyntaxException e) {
            // JSON 파싱 중 오류가 발생한 경우 처리
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    private AiModel getAiModel(AutoModelRequest request) {
        return aiModelRepository.findById(request.getModelId())
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private HashMap<String, Integer> getLabelMap(Project project) {
        HashMap<String, Integer> labelMap = new HashMap<>();
        List<ProjectCategory> category = project.getCategoryList();
        for (ProjectCategory projectCategory : category) {
            if (labelMap.containsKey(projectCategory.getLabelName())) {
                continue;
            }
            labelMap.put(projectCategory.getLabelName(), projectCategory.getId());
        }

        return labelMap;
    }

    private Image getImage(final Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    private Project getProject(final Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    private Workspace getWorkspace(final Integer memberId, final Integer workspaceId) {
        return workspaceRepository.findByMemberIdAndId(memberId, workspaceId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    private Member getMember(final Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private void checkNotAdminParticipant(final Integer memberId, final Integer projectId) {
        if (participantRepository.existsByProjectIdAndMemberIdAndPrivilege(projectId, memberId, PrivilegeType.ADMIN)) {
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    private void checkSelfParticipant(final Integer memberId, final Integer addMemberId) {
        if (Objects.equals(memberId, addMemberId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_BAD_REQUEST);
        }
    }

    private String getFirstImageWithProject(final Project project) {
        Optional<Image> image = imageRepository.findFirstImageByProjectId(project.getId());
        if (image.isPresent()) {
            return image.get().getImagePath();
        }

        return "https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-760x460.png";
    }
}
