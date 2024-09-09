import '@/index.css';
import { Meta, StoryObj } from '@storybook/react';
import Home from '.';
import { useState } from 'react';

const HomeWrapper = ({ initialLoggedIn }: { initialLoggedIn: boolean }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);

  return (
    <Home
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
};

const meta: Meta<typeof Home> = {
  title: 'Components/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Home>;

export const GoogleLogin: Story = {
  render: () => <HomeWrapper initialLoggedIn={false} />,
};

export const SelectWorkspace: Story = {
  render: () => <HomeWrapper initialLoggedIn={true} />,
};
