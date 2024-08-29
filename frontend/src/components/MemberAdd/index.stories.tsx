import { Meta, StoryObj } from '@storybook/react';
import MemberAddModal from '.';

const meta: Meta<typeof MemberAddModal> = {
  title: 'Modal/MemberAddModal',
  component: MemberAddModal,
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof MemberAddModal>;

export const Default: Story = {
  args: {
    title: '프로젝트 멤버 초대하기',
  },
};
