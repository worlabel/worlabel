import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import ReviewList from '.';

const meta: Meta<typeof ReviewList> = {
  title: 'Components/ReviewList',
  component: ReviewList,
};

export default meta;

type Story = StoryObj<typeof ReviewList>;

export const Default: Story = {
  args: {
    acceptedCount: 10,
    rejectedCount: 5,
    pendingCount: 7,
    totalCount: 22,
    items: [
      {
        title: '갤럭시22 생산 라인 이물질 분류',
        createdTime: '2 hours ago',
        creatorName: 'Kim Tae Su',
        project: 'Project A',
        type: 'Classification',
        status: 'needs_review',
      },
      {
        title: '갤럭시 흠집 객체 탐지',
        createdTime: '3 hours ago',
        creatorName: 'Kim Tae Su',
        project: 'Project B',
        type: 'Detection',
        status: 'completed',
      },
      {
        title: '갤럭시 흠집 경계 폴리곤',
        createdTime: '5 hours ago',
        creatorName: 'Kim Tae Su',
        project: 'Project C',
        type: 'Polygon',
        status: 'in_progress',
      },
      {
        title: '갤럭시 흠집 폴리라인',
        createdTime: '1 day ago',
        creatorName: 'Kim Tae Su',
        project: 'Project D',
        type: 'Polyline',
        status: 'completed',
      },
      {
        title: '갤럭시 흠집 디텍션 허가 요청',
        createdTime: '6 hours ago',
        creatorName: 'Kim Tae Su',
        project: 'Project E',
        type: 'Detection',
        status: 'pending',
      },
    ],
  },
};
