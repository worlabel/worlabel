import React from 'react';
import { Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import ImagePreSignedForm from '../ImagePreSignedForm';

export default function WorkspaceDropdownMenu({
  projectId,
  folderId,
  onRefetch,
}: {
  projectId: number;
  folderId: number;
  onRefetch: () => void;
}) {
  const [isOpenUpload, setIsOpenUpload] = React.useState<boolean>(false);
  const [fileCount, setFileCount] = React.useState<number>(0);
  const [uploadType, setUploadType] = React.useState<'file' | 'folder' | 'zip'>('file');

  const handleFileCount = (fileCount: number) => {
    setFileCount(fileCount);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Menu size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => {
              setUploadType('file');
              setIsOpenUpload(true);
            }}
          >
            파일 업로드
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setUploadType('folder');
              setIsOpenUpload(true);
            }}
          >
            폴더 업로드
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setUploadType('zip');
              setIsOpenUpload(true);
            }}
          >
            압축 파일 업로드
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isOpenUpload}
        onOpenChange={setIsOpenUpload}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader
            title={
              uploadType === 'folder'
                ? '폴더 업로드'
                : uploadType === 'zip'
                  ? '압축 파일 업로드'
                  : fileCount > 0
                    ? `파일 업로드 (${fileCount})`
                    : '파일 업로드'
            }
          />
          <ImagePreSignedForm
            onClose={() => setIsOpenUpload(false)}
            onRefetch={onRefetch}
            onFileCount={handleFileCount}
            projectId={projectId}
            folderId={folderId}
            uploadType={uploadType}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
