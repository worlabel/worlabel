import '@/index.css';
import { Meta, StoryObj } from '@storybook/react';
import ProjectCard from '.';

const meta: Meta<typeof ProjectCard> = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    title: '프로젝트 제목',
    description: '프로젝트 내용',
  },
};
