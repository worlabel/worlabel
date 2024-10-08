import '@/index.css';
import { Meta } from '@storybook/react';
import WorkspaceLayout from '.';

const meta: Meta<typeof WorkspaceLayout> = {
  title: 'Layout/WorkspaceLayout',
  component: WorkspaceLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => <WorkspaceLayout />;

export default meta;
