import '@/index.css';
import WorkspaceSidebar from '.';
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { Project } from '@/types';
import { Meta } from '@storybook/react';
import { Component } from 'react';

const meta: Meta<typeof Component> = {
  title: 'Workspace/WorkspaceSidebar',
  component: WorkspaceSidebar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

const projects: Project[] = [
  {
    id: 1,
    name: 'project-111',
    type: 'segmentation',
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
    type: 'classification',
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
];

export const Default = () => (
  <div className="h-screen">
    <ResizablePanelGroup direction="horizontal">
      <WorkspaceSidebar
        workspaceName="Workspace-name-1"
        projects={projects}
      />
      <ResizablePanel className="flex w-full items-center justify-center">
        <div>Content</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);
