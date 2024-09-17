import '@/index.css';
import { Meta, StoryObj } from '@storybook/react';
import AdminLayout from './index';
import { Workspace } from '@/types';

const meta: Meta<typeof AdminLayout> = {
  title: 'Layout/AdminLayout',
  component: AdminLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AdminLayout>;

const workspace: Workspace = {
  id: 1,
  name: 'Workspace Alpha',
  projects: [
    {
      id: 1,
      name: 'Project Alpha',
      type: 'Segmentation',
      children: [],
    },
    {
      id: 2,
      name: 'Project Beta',
      type: 'Classification',
      children: [],
    },
  ],
};

export const Default: Story = {
  render: () => <AdminLayout workspace={workspace} />,
};
