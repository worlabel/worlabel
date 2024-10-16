import '@/index.css';
import CanvasControlBar from '.';

export default {
  title: 'Components/CanvasControlBar',
  component: CanvasControlBar,
};

export const Default = () => (
  <CanvasControlBar
    saveJson={() => {}}
    projectType="segmentation"
    categories={[
      {
        id: 1,
        labelName: 'label',
      },
    ]}
  />
);
