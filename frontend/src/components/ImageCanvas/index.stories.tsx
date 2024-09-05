import '@/index.css';
import { Meta } from '@storybook/react';
import ImageCanvas from '.';

const meta: Meta<typeof ImageCanvas> = {
  title: 'Components/ImageCanvas',
  component: ImageCanvas,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default = () => <ImageCanvas />;
