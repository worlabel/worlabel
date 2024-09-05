import type { Meta, StoryObj } from '@storybook/react';
import TaskCard from './index';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
};

export default meta;

type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
  args: {
    projectName: 'Project1',
    taskName: 'Task1',
    status: 'In Review',
    taskType: 'Segmentation',
    labels: [
      { name: 'Car', count: 25 },
      { name: 'Human', count: 37 },
    ],
    createdOn: '2024-09-02',
    memberCount: 3,
    width: '444px',
    // statusColor: 'text-blue-600 dark:text-blue-400',
  },
};
