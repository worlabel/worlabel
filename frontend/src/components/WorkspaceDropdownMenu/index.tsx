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
import ImageUploadForm from '../ImageUploadModal/ImageUploadForm';
import ImageUploadPresignedForm from '../ImageUploadPresignedModal/ImageUploadPresignedForm';
import useUploadImageFileQuery from '@/queries/projects/useUploadImageFileQuery';
import useUploadImageFolderFileQuery from '@/queries/projects/useUploadImageFolderFileQuery';
import useUploadImageZipQuery from '@/queries/projects/useUploadImageZipQuery';
import useUploadImageFolderQuery from '@/queries/projects/useUploadImageFolderQuery';

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
  const [isOpenUploadPresigned, setIsOpenUploadPresigned] = React.useState<boolean>(false);
  const [presignedCount, setPresignedCount] = React.useState<number>(0);
  const [isOpenUploadFolderFile, setIsOpenUploadFolderFile] = React.useState<boolean>(false);
  const [isOpenUploadFolder, setIsOpenUploadFolder] = React.useState<boolean>(false);
  const [isOpenUploadZip, setIsOpenUploadZip] = React.useState<boolean>(false);

  const uploadImageZipMutation = useUploadImageZipQuery();
  const uploadImageFolderFileMutation = useUploadImageFolderFileQuery();
  const uploadImageFileMutation = useUploadImageFileQuery();
  const uploadImageFolderMutation = useUploadImageFolderQuery();

  const handleCloseUploadFile = () => setIsOpenUploadFile(false);
  const handleCloseUploadFolderFile = () => setIsOpenUploadFolderFile(false);
  const handleCloseUploadFolder = () => setIsOpenUploadFolder(false);
  const handleCloseUploadZip = () => setIsOpenUploadZip(false);

  const handleFileCount = (fileCount: number) => {
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
          <DropdownMenuItem onClick={() => console.log('프로젝트 이름 수정')}>프로젝트 이름 수정</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpenUploadFile(true)}>파일 업로드</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenUploadPresigned(true)}>
            파일 업로드 (PresignedUrl 이용)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenUploadFolderFile(true)}>
            폴더 업로드 (파일 업로드 API 이용)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenUploadFolder(true)}>
            폴더 업로드 (백엔드 구현 필요)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenUploadZip(true)}>폴더 압축파일 업로드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isOpenUploadFile}
        onOpenChange={setIsOpenUploadFile}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader title={fileCount > 0 ? `파일 업로드 (${fileCount})` : '파일 업로드'} />
          <ImageUploadForm
            onClose={handleCloseUploadFile}
            onRefetch={onRefetch}
            onFileCount={(fileCount: number) => setFileCount(fileCount)}
            projectId={projectId}
            folderId={folderId}
            uploadImageZipMutation={uploadImageZipMutation}
            uploadImageFolderFileMutation={uploadImageFolderFileMutation}
            uploadImageFileMutation={uploadImageFileMutation}
            uploadImageFolderMutation={uploadImageFolderMutation}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenUploadPresigned}
        onOpenChange={setIsOpenUploadPresigned}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader
            title={presignedCount > 0 ? `파일 업로드 PreSigned (${presignedCount})` : '파일 업로드 PreSigned'}
          />
          <ImageUploadPresignedForm
            onClose={() => setIsOpenUploadPresigned(false)}
            onRefetch={onRefetch}
            onFileCount={(fileCount: number) => setPresignedCount(fileCount)}
            projectId={projectId}
            folderId={folderId}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenUploadFolderFile}
        onOpenChange={setIsOpenUploadFolderFile}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader title="폴더 업로드 (파일 업로드 API 이용)" />
          <ImageUploadForm
            onClose={handleCloseUploadFolderFile}
            onRefetch={onRefetch}
            onFileCount={handleFileCount}
            projectId={projectId}
            folderId={folderId}
            isFolderUpload={true}
            uploadImageZipMutation={uploadImageZipMutation}
            uploadImageFolderFileMutation={uploadImageFolderFileMutation}
            uploadImageFileMutation={uploadImageFileMutation}
            uploadImageFolderMutation={uploadImageFolderMutation}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOpenUploadFolder}
        onOpenChange={setIsOpenUploadFolder}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader title="폴더 업로드 (백엔드 구현 필요)" />
          <ImageUploadForm
            onClose={handleCloseUploadFolder}
            onRefetch={onRefetch}
            onFileCount={handleFileCount}
            projectId={projectId}
            folderId={folderId}
            isFolderBackendUpload={true}
            uploadImageZipMutation={uploadImageZipMutation}
            uploadImageFolderFileMutation={uploadImageFolderFileMutation}
            uploadImageFileMutation={uploadImageFileMutation}
            uploadImageFolderMutation={uploadImageFolderMutation}
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
          <ImageUploadForm
            onClose={handleCloseUploadZip}
            onRefetch={onRefetch}
            onFileCount={handleFileCount}
            projectId={projectId}
            folderId={folderId}
            isZipUpload={true}
            uploadImageZipMutation={uploadImageZipMutation}
            uploadImageFolderFileMutation={uploadImageFolderFileMutation}
            uploadImageFileMutation={uploadImageFileMutation}
            uploadImageFolderMutation={uploadImageFolderMutation}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
