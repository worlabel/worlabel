import { Project } from '@/types';
import { Play, SquarePenIcon, Upload } from 'lucide-react';
import ProjectFileItem from './ProjectFileItem';
import ProjectDirectoryItem from './ProjectDirectoryItem';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import useCanvasStore from '@/stores/useCanvasStore';
import { Button } from '../ui/button';
import { useEffect } from 'react';

export default function ProjectStructure({ project }: { project: Project }) {
  const setProject = useCanvasStore((state) => state.setProject);
  const image = useCanvasStore((state) => state.image);
  const { data: folderData } = useFolderQuery(project.id.toString(), 0);

  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col overflow-y-auto px-1 pb-2">
        <header className="flex w-full items-center gap-2 rounded p-1">
          <div className="flex w-full items-center gap-1 overflow-hidden pr-1">
            <h3 className="caption overflow-hidden text-ellipsis whitespace-nowrap">{project.type}</h3>
          </div>
          <button
            className="flex gap-1"
            onClick={() => console.log('edit project')}
          >
            <SquarePenIcon size={16} />
          </button>
          <button
            className="flex gap-1"
            onClick={() => console.log('upload image')}
          >
            <Upload size={16} />
          </button>
        </header>
        {folderData.children.length === 0 && folderData.images.length === 0 ? (
          <div className="body-small flex h-full select-none items-center justify-center text-gray-400">
            빈 프로젝트입니다.
          </div>
        ) : (
          <div className="caption flex flex-col">
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

      <div className="flex p-2.5">
        <Button
          variant="outlinePrimary"
          className="w-full"
          onClick={() => console.log('autolabel')}
        >
          <Play
            size={16}
            className="mr-1"
          />
          <span>자동 레이블링</span>
        </Button>
      </div>
    </div>
  );
}
