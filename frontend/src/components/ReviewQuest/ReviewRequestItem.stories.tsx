import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import ReviewRequestItem from './ReviewRequestItem';

const meta: Meta<typeof ReviewRequestItem> = {
  title: 'Components/ReviewRequestItem',
  component: ReviewRequestItem,
  argTypes: {
    title: { control: 'text', description: 'Title of the review request' },
    createdTime: { control: 'text', description: 'Time when the review was created' },
    creatorName: { control: 'text', description: 'Name of the creator' },
    project: { control: 'text', description: 'Project name' },
    status: { control: 'text', description: 'Status of the review request' },
    commentsCount: { control: 'number', description: 'Number of comments' },
    updatesCount: { control: 'number', description: 'Number of updates' },
    lastUpdated: { control: 'text', description: 'Time when the review was last updated' },
    type: {
      control: 'object',
      description: 'Label for the request type with text and color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReviewRequestItem>;

export const Default: Story = {
  args: {
    title: 'Feat: 워크스페이스 멤버 추가 구현 - S11P21S002-37',
    createdTime: '!24 · created 2 hours ago',
    creatorName: '김태수',
    project: 'be/develop',
    status: 'Merged',
    commentsCount: 4,
    updatesCount: 1,
    lastUpdated: 'updated 1 hour ago',
    type: { text: 'Classification', color: '#a2eeef' },
  },
};
