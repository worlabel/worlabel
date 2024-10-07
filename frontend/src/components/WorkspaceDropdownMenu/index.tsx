import React from 'react';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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

  const handleCloseUpload = () => setIsOpenUpload(false);

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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setUploadType('folder');
              setIsOpenUpload(true);
            }}
          >
            폴더 업로드
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
              fileCount > 0
                ? `파일 업로드 (${fileCount})`
                : uploadType === 'file'
                  ? '파일 업로드'
                  : uploadType === 'folder'
                    ? '폴더 업로드'
                    : '압축 파일 업로드'
            }
          />
          <ImagePreSignedForm
            onClose={handleCloseUpload}
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
