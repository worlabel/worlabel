import React from 'react';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import ImagePreSignedForm from '../ImagePreSignedForm';
import useDeleteImageQuery from '@/queries/images/useDeleteImageQuery';
import useDeleteFolderQuery from '@/queries/folders/useDeleteFolderQuery';
import useUpdateFolderQuery from '@/queries/folders/useUpdateFolderQuery';
import useCreateFolderQuery from '@/queries/folders/useCreateFolderQuery';
import { FolderRequest } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import useAuthStore from '@/stores/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectContextMenuProps {
  projectId: number;
  folderId: number;
  node?: { id: number; type: 'folder' | 'image'; name?: string };
  onRefetch: () => void;
}

const MENU_ID = 'project-menu';

export default function ProjectContextMenu({ projectId, folderId, node, onRefetch }: ProjectContextMenuProps) {
  const [isOpenUpload, setIsOpenUpload] = React.useState<boolean>(false);
  const [uploadType, setUploadType] = React.useState<'file' | 'folder' | 'zip'>('file');
  const [fileCount, setFileCount] = React.useState<number>(0);

  const { profile } = useAuthStore();
  const memberId = profile?.id ?? 0;

  const deleteImageMutation = useDeleteImageQuery();
  const deleteFolderMutation = useDeleteFolderQuery();
  const updateFolderMutation = useUpdateFolderQuery();
  const createFolderMutation = useCreateFolderQuery();
  const queryClient = useQueryClient();

  const { show } = useContextMenu({ id: MENU_ID });

  const handleContextMenu = (event: React.MouseEvent) => {
    show({ event });
  };

  const handleItemClick = ({ id }: ItemParams) => {
    switch (id) {
      case 'rename':
        handleRename();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'createFolder':
        handleCreateFolder();
        break;
      case 'uploadFile':
        setUploadType('file');
        setIsOpenUpload(true);
        break;
      case 'uploadFolder':
        setUploadType('folder');
        setIsOpenUpload(true);
        break;
      case 'uploadZip':
        setUploadType('zip');
        setIsOpenUpload(true);
        break;
      default:
        break;
    }
  };

  const handleFileCount = (count: number) => {
    setFileCount(count);
  };

  const handleRename = () => {
    if (node?.type === 'folder') {
      const newName = prompt('폴더의 새 이름을 입력하세요:', node.name);
      if (newName && node.id) {
        updateFolderMutation.mutate(
          {
            projectId,
            folderId: node.id,
            folderData: {
              title: newName,
              parentId: folderId,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['folder', projectId, folderId] });
              queryClient.invalidateQueries({ queryKey: ['folder', projectId, node.id] });
              onRefetch();
            },
          }
        );
      }
    }
  };
  const handleDelete = () => {
    if (node?.type === 'folder') {
      deleteFolderMutation.mutate(
        { projectId, folderId: node.id, memberId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder', projectId] });
            onRefetch();
          },
        }
      );
    } else if (node?.type === 'image') {
      deleteImageMutation.mutate(
        { projectId, folderId, imageId: node.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folder', projectId] });
            queryClient.invalidateQueries({ queryKey: ['image', node.id] });
            onRefetch();
          },
        }
      );
    }
  };

  const handleCreateFolder = () => {
    const newFolderName = prompt('새 폴더의 이름을 입력하세요:');
    if (newFolderName) {
      createFolderMutation.mutate(
        {
          projectId,
          folderData: { title: newFolderName, parentId: node?.id || folderId } as FolderRequest,
        },
        {
          onSuccess: () => {
            console.log(folderId, node?.id);
            queryClient.invalidateQueries({ queryKey: ['folder', projectId] });

            onRefetch();
          },
        }
      );
    }
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}></div>

      <Menu id={MENU_ID}>
        {node?.type === 'folder' && (
          <>
            <Item
              id="rename"
              onClick={handleItemClick}
            >
              폴더 이름 수정
            </Item>
            <Item
              id="delete"
              onClick={handleItemClick}
            >
              폴더 삭제
            </Item>
            <Item
              id="createFolder"
              onClick={handleItemClick}
            >
              새 폴더 생성
            </Item>
            <Item
              id="uploadFile"
              onClick={handleItemClick}
            >
              파일 업로드
            </Item>
            <Item
              id="uploadFolder"
              onClick={handleItemClick}
            >
              폴더 업로드
            </Item>
            <Item
              id="uploadZip"
              onClick={handleItemClick}
            >
              압축 파일 업로드
            </Item>
          </>
        )}
        {node?.type === 'image' && (
          <Item
            id="delete"
            onClick={handleItemClick}
          >
            이미지 삭제
          </Item>
        )}
      </Menu>

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
            folderId={node?.id ?? folderId}
            uploadType={uploadType}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
