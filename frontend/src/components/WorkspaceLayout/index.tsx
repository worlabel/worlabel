import { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import Header from '../Header';
import { Label, Project } from '@/types';
import { ResizablePanelGroup, ResizablePanel } from '../ui/resizable';
import WorkspaceSidebar from '../WorkspaceSidebar';
import WorkspaceLabelBar from '../WorkspaceLabelBar';
import useAuthStore from '@/stores/useAuthStore';
import useCanvasStore from '@/stores/useCanvasStore';
import useFolderQuery from '@/queries/useFolderQuery';
import useWorkspaceQuery from '@/queries/useWorkspaceQuery';
import useProjectListQuery from '@/queries/useProjectListQuery';

const mockLabels: Label[] = [
  {
    id: 1,
    name: 'Label 1',
    color: '#FFaa33',
    coordinates: [
      [700, 100],
      [1200, 800],
    ],
    type: 'rect',
  },
  {
    id: 2,
    name: 'Label 2',
    color: '#aaFF55',
    coordinates: [
      [200, 200],
      [400, 200],
      [500, 500],
      [400, 800],
      [200, 800],
      [100, 500],
    ],
    type: 'polygon',
  },
  {
    id: 3,
    name: 'Label 3',
    color: '#77aaFF',
    coordinates: [
      [1000, 1000],
      [1800, 1800],
    ],
    type: 'rect',
  },
];

export default function WorkspaceLayout() {
  const setLabels = useCanvasStore((state) => state.setLabels);
  const params = useParams<{ workspaceId: string; projectId: string }>();
  const workspaceId = Number(params.workspaceId);
  const projectId = Number(params.projectId);
  const [workspace, setWorkspace] = useState<{ name: string; projects: Project[] }>({
    name: '',
    projects: [],
  });
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;
  const { data: workspaceData } = useWorkspaceQuery(workspaceId, memberId);
  const { data: projectListData } = useProjectListQuery(workspaceId, memberId);
  const { data: folderData } = useFolderQuery(projectId, 0, memberId);

  useEffect(() => {
    if (!workspaceData) return;
    setWorkspace((prev) => ({
      ...prev,
      name: workspaceData.title,
    }));
  }, [workspaceData]);

  useEffect(() => {
    if (!projectListData) return;
    console.log(folderData);
    const projects = projectListData.workspaceResponses.map(
      (project): Project => ({
        id: project.id,
        name: project.title,
        type: (project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)) as
          | 'Classification'
          | 'Detection'
          | 'Segmentation',
        children: [],
      })
    );
    setWorkspace((prev) => ({
      ...prev,
      projects,
    }));
  }, [projectListData]);

  // useEffect(() => {
  //   const fetchWorkspaceData = async (workspaceId: number, memberId: number) => {
  //     try {
  //       const workspaceResponse = await getWorkspaceApi(workspaceId, memberId);
  //       if (workspaceResponse.isSuccess) {
  //         const workspaceTitle = workspaceResponse.data.title;
  //         setWorkspace((prev) => ({
  //           ...prev,
  //           name: workspaceTitle,
  //         }));
  //         fetchProjects(workspaceId, memberId);
  //       }
  //     } catch (error) {
  //       console.error('워크스페이스 조회 실패:', error);
  //     }
  //   };

  //   const fetchProjects = async (workspaceId: number, memberId: number) => {
  //     try {
  //       const projectResponse = await getAllProjectsApi(workspaceId, memberId);
  //       if (projectResponse.isSuccess) {
  //         const projects = await Promise.all(
  //           projectResponse.data.workspaceResponses.map(async (project) => {
  //             const children = await fetchFolderWithImages(project.id, memberId);
  //             return {
  //               id: project.id,
  //               name: project.title,
  //               type: capitalizeType(project.projectType),
  //               children,
  //             };
  //           })
  //         );
  //         setWorkspace((prev) => ({
  //           ...prev,
  //           projects: projects as Project[],
  //         }));
  //       }
  //     } catch (error) {
  //       console.error('프로젝트 목록 조회 실패:', error);
  //     }
  //   };

  //   const fetchFolderWithImages = async (projectId: number, memberId: number): Promise<DirectoryItem[]> => {
  //     try {
  //       const folderResponse = await fetchFolderApi(projectId, 0, memberId);
  //       if (folderResponse.isSuccess) {
  //         const files: FileItem[] = folderResponse.data.images.map((image) => ({
  //           id: image.id,
  //           name: image.imageTitle,
  //           url: image.imageUrl,
  //           type: 'image',
  //           status: image.status === 'COMPLETED' ? 'done' : 'idle',
  //         }));

  //         return [
  //           {
  //             id: folderResponse.data.id,
  //             name: folderResponse.data.title,
  //             type: 'directory',
  //             children: files,
  //           },
  //         ];
  //       }
  //       return [];
  //     } catch (error) {
  //       console.error('폴더 및 이미지 조회 실패:', error);
  //       return [];
  //     }
  //   };

  //   const capitalizeType = (
  //     type: 'classification' | 'detection' | 'segmentation'
  //   ): 'Classification' | 'Detection' | 'Segmentation' => {
  //     switch (type) {
  //       case 'classification':
  //         return 'Classification';
  //       case 'detection':
  //         return 'Detection';
  //       case 'segmentation':
  //         return 'Segmentation';
  //       default:
  //         throw new Error(`Unknown project type: ${type}`);
  //     }
  //   };

  //   if (workspaceId && memberId) {
  //     fetchWorkspaceData(Number(workspaceId), memberId);
  //   }
  // }, [workspaceId, projectId, memberId]);

  useEffect(() => {
    setLabels(mockLabels);
  }, [setLabels]);

  return (
    <>
      <Header className="fixed left-0 top-0" />
      <div className="mt-16 h-[calc(100vh-64px)] w-screen">
        <ResizablePanelGroup direction="horizontal">
          <WorkspaceSidebar
            workspaceName={workspace.name}
            projects={workspace.projects}
          />
          <ResizablePanel className="flex w-full items-center">
            <main className="h-full grow">
              <Outlet />
            </main>
            <WorkspaceLabelBar labels={mockLabels} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
