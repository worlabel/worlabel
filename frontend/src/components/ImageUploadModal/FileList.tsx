import { cn } from '@/lib/utils';
import CloseButton from './CloseButton';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export default function FileList({ files, onRemoveFile }: FileListProps): JSX.Element {
  return (
    <div className="max-h-52 max-w-full overflow-y-auto overflow-x-hidden">
      <ul className="m-0 list-none p-0">
        {files.map((file, index) => (
          <li
            key={index}
            className={cn('flex items-center justify-between px-4 py-2')}
          >
            <span className="truncate">{file.name}</span>
            <CloseButton
              color="red"
              size={16}
              onClick={() => onRemoveFile(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
