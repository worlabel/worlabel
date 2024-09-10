import '@/index.css';
import { Meta, StoryObj } from '@storybook/react';
import PageLayout from '.';

const meta: Meta<typeof PageLayout> = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
  render: () => <PageLayout></PageLayout>,
};
