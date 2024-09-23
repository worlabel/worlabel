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

export default function WorkspaceDropdownMenu({ projectId, folderId }: { projectId: number; folderId: number }) {
  const [isOpenUploadFile, setIsOpenUploadFile] = React.useState(false);
  const [isOpenUploadFolder, setIsOpenUploadFolder] = React.useState(false);
  const [isOpenUploadZip, setIsOpenUploadZip] = React.useState(false);

  const handleOpenUploadFile = () => setIsOpenUploadFile(true);
  const handleCloseUploadFile = () => setIsOpenUploadFile(false);
  const handleOpenUploadFolder = () => setIsOpenUploadFolder(true);
  const handleCloseUploadFolder = () => setIsOpenUploadFolder(false);
  const handleOpenUploadZip = () => setIsOpenUploadZip(true);
  const handleCloseUploadZip = () => setIsOpenUploadZip(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Menu size={16} />
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
          <DropdownMenuItem onClick={handleOpenUploadFolder}>폴더 업로드</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenUploadZip}>폴더 압축파일 업로드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isOpenUploadFile}
        onOpenChange={setIsOpenUploadFile}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader title="파일 업로드" />
          <ImageUploadFileForm
            onClose={handleCloseUploadFile}
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
          <DialogHeader title="폴더 업로드" />
          <ImageUploadFolderForm
            onClose={handleCloseUploadFolder}
            projectId={projectId}
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
            projectId={projectId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
