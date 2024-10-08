import { FolderResponse, ChildFolder, ImageResponse } from '@/types';
import { TreeNode } from 'react-treebeard';

export default function buildTreeNodes(folder: FolderResponse): TreeNode[] {
  const childFolders: TreeNode[] = folder.children.map((child: ChildFolder) => ({
    id: child.id.toString(),
    name: child.title,
    children: [],
  }));

  const images: TreeNode[] = folder.images.map((image: ImageResponse) => ({
    id: image.id.toString(),
    name: image.imageTitle,
    imageData: image,
    children: [],
  }));

  return [...childFolders, ...images];
}
