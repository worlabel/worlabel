import { Outlet } from 'react-router-dom';
import Header from '../Header';
import { Label, Project } from '@/types';
import { ResizablePanelGroup, ResizablePanel } from '../ui/resizable';
import WorkspaceSidebar from '../WorkspaceSidebar';
import WorkspaceLabelBar from '../WorkspaceLabelBar';

export default function WorkspaceLayout() {
  const workspace: { name: string; projects: Project[] } = {
    name: 'Workspace-name-1',
    projects: [
      {
        id: 1,
        name: 'project-111',
        type: 'Segmentation',
        children: [
          {
            id: 12,
            type: 'directory',
            name: 'directory-1',
            children: [
              {
                id: 123,
                type: 'directory',
                name: 'directory-2',
                children: [
                  { id: 1, url: '', type: 'image', name: 'image-1.jpg', status: 'done' },
                  { id: 1, url: '', type: 'image', name: 'image-2.jpg', status: 'idle' },
                ],
              },
              { id: 1, url: '', type: 'image', name: 'image-1.jpg', status: 'idle' },
              { id: 1, url: '', type: 'image', name: 'image-2.jpg', status: 'done' },
            ],
          },
          { id: 1, url: '', type: 'image', name: 'image-1.jpg', status: 'done' },
        ],
      },
      {
        id: 2,
        name: 'very-extremely-long-long-project-name-222',
        type: 'Classification',
        children: [
          {
            id: 23,
            type: 'directory',
            name: 'this-is-my-very-very-long-directory-name-that-will-be-overflow',
            children: [
              { id: 1, url: '', type: 'image', name: 'image-1.jpg', status: 'done' },
              { id: 1, url: '', type: 'image', name: 'image-2.jpg', status: 'done' },
            ],
          },
          {
            id: 1,
            url: '',
            type: 'image',
            name: 'wow-this-is-my-very-very-long-image-name-so-this-will-be-overflow-too.jpg',
            status: 'idle',
          },
        ],
      },
    ],
  };
  const labels: Label[] = [
    {
      id: 1,
      name: 'Label 1',
      color: '#FFaa33',
      coordinates: [],
      type: 'rect',
    },
    {
      id: 2,
      name: 'Label 2',
      color: '#aaFF55',
      coordinates: [],
      type: 'rect',
    },
    {
      id: 3,
      name: 'Label 3',
      color: '#77aaFF',
      coordinates: [],
      type: 'rect',
    },
  ];

  return (
    <>
      <Header className="fixed left-0 top-0" />
      <div className="mt-16 h-[calc(100vh-64px)] w-screen">
        <ResizablePanelGroup direction="horizontal">
          <WorkspaceSidebar
            workspaceName={workspace.name}
            projects={workspace.projects}
          />
          <ResizablePanel className="flex w-full items-center">
            <main className="h-full grow">
              <Outlet />
            </main>
            <WorkspaceLabelBar labels={labels} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
