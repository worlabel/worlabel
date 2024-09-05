import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import ReviewRequest from '.';

const meta: Meta<typeof ReviewRequest> = {
  title: 'Components/ReviewRequest',
  component: ReviewRequest,
};

export default meta;

type Story = StoryObj<typeof ReviewRequest>;

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
        commentsCount: 4,
        updatesCount: 1,
        lastUpdated: '1 hour ago',
      },
      {
        title: '갤럭시 흠집 객체 탐지',
        createdTime: '3 hours ago',
        creatorName: 'Kim Tae Su',
        project: 'Project B',
        type: 'Detection',
        status: 'completed',
        commentsCount: 2,
        updatesCount: 3,
        lastUpdated: '30 minutes ago',
      },
      {
        title: '갤럭시 흠집 경계 폴리곤',
        createdTime: '5 hours ago',
        creatorName: 'Kim Tae Su',
        project: 'Project C',
        type: 'Polygon',
        status: 'in_progress',
        commentsCount: 3,
        updatesCount: 2,
        lastUpdated: '2 hours ago',
      },
      {
        title: '갤럭시 흠집 폴리라인',
        createdTime: '1 day ago',
        creatorName: 'Kim Tae Su',
        project: 'Project D',
        type: 'Polyline',
        status: 'completed',
        commentsCount: 5,
        updatesCount: 0,
        lastUpdated: '20 minutes ago',
      },
      {
        title: '갤럭시 흠집 디텍션 허가 요청',
        createdTime: '6 hours ago',
        creatorName: 'Kim Tae Su',
        project: 'Project E',
        type: 'Detection',
        status: 'pending',
        commentsCount: 1,
        updatesCount: 4,
        lastUpdated: '3 hours ago',
      },
    ],
  },
};
