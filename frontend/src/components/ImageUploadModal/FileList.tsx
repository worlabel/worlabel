import CloseButton from './CloseButton';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export default function FileList({ files, onRemoveFile }: FileListProps): JSX.Element {
  return (
    <div className="max-w-full overflow-x-hidden overflow-y-auto max-h-52">
      <ul className="p-0 m-0 list-none">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between px-4 py-2"
          >
            <span className="truncate">{file.name}</span>
            <CloseButton
              color="red"
              onClick={() => onRemoveFile(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
