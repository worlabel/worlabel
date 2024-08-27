import '@/index.css';
import ProjectCreateModal from '.';

export default {
  title: 'Modal/ProjectCreateModal',
  component: ProjectCreateModal,
};

export const Default = () => (
  <ProjectCreateModal
    onClose={() => {
      console.log('close');
    }}
    onSubmit={(data) => {
      console.log(data);
    }}
  />
);
