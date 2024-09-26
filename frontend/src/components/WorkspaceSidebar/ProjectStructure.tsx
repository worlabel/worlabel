import { Project } from '@/types';
import { LoaderCircle, Play } from 'lucide-react';
import ProjectFileItem from './ProjectFileItem';
import ProjectDirectoryItem from './ProjectDirectoryItem';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import useCanvasStore from '@/stores/useCanvasStore';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import WorkspaceDropdownMenu from '../WorkspaceDropdownMenu';
import useAutoLabelQuery from '@/queries/projects/useAutoLabelQuery';
import useProjectStore from '@/stores/useProjectStore';

export default function ProjectStructure({ project }: { project: Project }) {
  const setProject = useProjectStore((state) => state.setProject);
  const image = useCanvasStore((state) => state.image);
  const { data: folderData, refetch } = useFolderQuery(project.id.toString(), 0);
  const requestAutoLabel = useAutoLabelQuery();

  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

  return (
    <div className="flex h-full min-h-0 grow-0 flex-col">
      <div className="flex h-full flex-col overflow-hidden px-1 pb-2">
        <header className="flex w-full items-center gap-2 rounded p-1">
          <div className="flex w-full min-w-0 items-center gap-1 pr-1">
            <h2 className="caption overflow-hidden text-ellipsis whitespace-nowrap text-gray-500">{project.type}</h2>
          </div>
          <WorkspaceDropdownMenu
            projectId={project.id}
            folderId={0}
            refetch={refetch}
          />
        </header>
        {folderData.children.length === 0 && folderData.images.length === 0 ? (
          <div className="body-small flex h-full select-none items-center justify-center text-gray-400">
            빈 프로젝트입니다.
          </div>
        ) : (
          <div className="caption flex flex-col overflow-y-auto">
            {folderData.children.map((item) => (
              <ProjectDirectoryItem
                key={`${project.id}-${item.title}`}
                projectId={project.id}
                item={item}
                initialExpanded={true}
              />
            ))}
            {folderData.images.map((item) => (
              <ProjectFileItem
                key={`${project.id}-${item.imageTitle}`}
                item={item}
                selected={image?.id === item.id}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex">
        <Button
          variant="outlinePrimary"
          className="w-full"
          disabled={requestAutoLabel.isPending}
          onClick={() => {
            requestAutoLabel.mutate(
              { projectId: project.id },
              {
                onSuccess: () => {
                  refetch;
                  setTimeout(() => {
                    alert('레이블링 성공!');
                  }, 100);
                },
                onError: () => {
                  alert('자동 레이블링을 요청하는 중 오류가 발생했습니다.');
                },
              }
            );
          }}
        >
          {requestAutoLabel.isPending ? (
            <>
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            </>
          ) : (
            <>
              <Play
                size={16}
                className="mr-1"
              />
              <span>자동 레이블링</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
