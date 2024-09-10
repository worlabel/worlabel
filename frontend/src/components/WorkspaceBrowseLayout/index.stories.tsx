import '@/index.css';
import { Meta, StoryObj } from '@storybook/react';
import WorkspaceBrowseLayout from '.';

const meta: Meta<typeof WorkspaceBrowseLayout> = {
  title: 'Layout/WorkspaceBrowseLayout',
  component: WorkspaceBrowseLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof WorkspaceBrowseLayout>;

export const Default: Story = {
  render: () => <WorkspaceBrowseLayout />,
};

export const Empty: Story = {
  render: () => <WorkspaceBrowseLayout />,
};
