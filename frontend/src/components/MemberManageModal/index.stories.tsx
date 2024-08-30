import { Meta, StoryObj } from '@storybook/react';
import MemberManageModal from '.';

const meta: Meta<typeof MemberManageModal> = {
  title: 'Modal/MemberManageModal',
  component: MemberManageModal,
  argTypes: {
    title: { control: 'text' },
    members: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof MemberManageModal>;

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
    onClose: () => console.log('Modal Closed'),
    onSubmit: (data) => console.log('Submitted Data:', data),
  },
};
