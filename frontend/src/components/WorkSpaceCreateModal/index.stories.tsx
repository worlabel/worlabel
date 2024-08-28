import '@/index.css';
import WorkSpaceCreateModal from '.';

export default {
  title: 'Modal/WorkSpaceCreateModal',
  component: WorkSpaceCreateModal,
};

export const Default = () => (
  <WorkSpaceCreateModal
    onClose={() => {
      console.log('close');
    }}
    onSubmit={(data) => {
      console.log(data);
    }}
  />
);
