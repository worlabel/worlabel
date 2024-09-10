import { Meta, StoryObj } from '@storybook/react';
import AdminMemberManage from '.';
import { MemberManageFormValues } from './AdminMemberManageForm';

const meta: Meta<typeof AdminMemberManage> = {
  title: 'Components/AdminMemberManage',
  component: AdminMemberManage,
  argTypes: {
    title: { control: 'text' },
    members: { control: 'object' },
    projects: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof AdminMemberManage>;

export const Default: Story = {
  args: {
    title: '프로젝트 멤버 관리하기',
    members: [
      { email: 'admin1@example.com', role: 'admin' },
      { email: 'admin2@example.com', role: 'admin' },
      { email: 'viewer3@example.com', role: 'viewer' },
      { email: 'editor1@example.com', role: 'editor' },
      { email: 'editor2@example.com', role: 'editor' },
      { email: 'editor3@example.com', role: 'editor' },
      { email: 'editor4@example.com', role: 'editor' },
    ],
    projects: [
      { id: 'project-1', name: '프로젝트 A' },
      { id: 'project-2', name: '프로젝트 B' },
      { id: 'project-3', name: '프로젝트 C' },
    ],
    onProjectChange: (projectId: string) => console.log('Selected Project:', projectId),
    onMemberInvite: () => console.log('Invite member'),
    onSubmit: (data: MemberManageFormValues) => console.log('Submitted:', data),
  },
};
