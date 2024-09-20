import { Project } from '@/types';
import { SquarePenIcon, Upload } from 'lucide-react';
import ProjectFileItem from './ProjectFileItem';
import ProjectDirectoryItem from './ProjectDirectoryItem';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import useCanvasStore from '@/stores/useCanvasStore';

export default function ProjectStructure({ project }: { project: Project }) {
  const image = useCanvasStore((state) => state.image);
  const { data: folderData } = useFolderQuery(project.id.toString(), 0);

  // TODO: 더미 데이터 제거
  folderData.images = [
    {
      id: 1,
      imagePath: 'https://worlabel-file-bucket.s3.ap-northeast-2.amazonaws.com/dummy.jpg',
      // dataPath: 'https://worlabel-file-bucket.s3.ap-northeast-2.amazonaws.com/detection.json',
      dataPath: 'https://worlabel-file-bucket.s3.ap-northeast-2.amazonaws.com/segmentation.json',
      imageTitle: 'dummy',
      status: 'PENDING',
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-1 pb-2">
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
  );
}
