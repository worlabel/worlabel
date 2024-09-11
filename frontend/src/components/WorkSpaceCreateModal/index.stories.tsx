import '@/index.css';
import WorkSpaceCreateModal from '.';

export default {
  title: 'Modal/WorkSpaceCreateModal',
  component: WorkSpaceCreateModal,
};

export const Default = () => (
  <WorkSpaceCreateModal
    onSubmit={(data) => {
      console.log(data);
    }}
  />
);
