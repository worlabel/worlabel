import '@/index.css';
import { Meta } from '@storybook/react';
import WorkspaceLabelBar from '.';
import { Label } from '@/types';

const meta: Meta<typeof WorkspaceLabelBar> = {
  title: 'Workspace/WorkspaceLabelBar',
  component: WorkspaceLabelBar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

const labels: Label[] = [
  {
    id: 1,
    name: 'Label 1',
    color: '#FFaa33',
    type: 'rect',
    coordinates: [],
  },
  {
    id: 2,
    name: 'Label 2',
    color: '#aaFF55',
    type: 'rect',
    coordinates: [],
  },
  {
    id: 3,
    name: 'Label 3',
    color: '#77aaFF',
    type: 'rect',
    coordinates: [],
  },
];

export const Default = () => {
  return (
    <div className="flex h-screen justify-end">
      <WorkspaceLabelBar labels={labels} />
    </div>
  );
};
