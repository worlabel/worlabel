import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import ImageUploadFileForm from '../ImageUploadFileModal/ImageUploadFileForm';
import React from 'react';
import ImageUploadFolderForm from '../ImageUploadFolderModal/ImageUploadFolderForm';
import ImageUploadZipForm from '../ImageUploadZipModal/ImageUploadZipForm';

export default function WorkspaceDropdownMenu({
  projectId,
  folderId,
  onRefetch,
}: {
  projectId: number;
  folderId: number;
  onRefetch: () => void;
}) {
  const [isOpenUploadFile, setIsOpenUploadFile] = React.useState<boolean>(false);
  const [fileCount, setFileCount] = React.useState<number>(0);
  const [isOpenUploadFolder, setIsOpenUploadFolder] = React.useState<boolean>(false);
  const [isOpenUploadZip, setIsOpenUploadZip] = React.useState<boolean>(false);

  const handleOpenUploadFile = () => setIsOpenUploadFile(true);

  const handleCloseUploadFile = () => {
    setIsOpenUploadFile(false);
  };

  const handleOpenUploadFolder = () => setIsOpenUploadFolder(true);

  const handleCloseUploadFolder = () => {
    setIsOpenUploadFolder(false);
  };

  const handleOpenUploadZip = () => setIsOpenUploadZip(true);

  const handleCloseUploadZip = () => {
    setIsOpenUploadZip(false);
  };

  const handleFileCount = (fileCount: number) => {
    console.log(fileCount);
    setFileCount(fileCount);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Menu
            size={16}
            className="stroke-gray-900"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => {
              console.log('프로젝트 이름 수정');
            }}
          >
            프로젝트 이름 수정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenUploadFile}>파일 업로드</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenUploadFolder}>폴더 업로드 (임시)</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenUploadZip}>폴더 압축파일 업로드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isOpenUploadFile}
        onOpenChange={setIsOpenUploadFile}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader title={fileCount > 0 ? `파일 업로드 (${fileCount})` : '파일 업로드'} />
          <ImageUploadFileForm
            onClose={handleCloseUploadFile}
            onRefetch={onRefetch}
            onFileCount={handleFileCount}
            projectId={projectId}
            folderId={folderId}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenUploadFolder}
        onOpenChange={setIsOpenUploadFolder}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader title="폴더 업로드 (임시)" />
          <ImageUploadFolderForm
            onClose={handleCloseUploadFolder}
            onRefetch={onRefetch}
            projectId={projectId}
            folderId={folderId}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenUploadZip}
        onOpenChange={setIsOpenUploadZip}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader title="폴더 압축파일 업로드" />
          <ImageUploadZipForm
            onClose={handleCloseUploadZip}
            onRefetch={onRefetch}
            projectId={projectId}
            folderId={folderId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
