import MemberAddModal from '.';

export default {
  title: 'Modal/MemberAddModal',
  component: MemberAddModal,
};

export const Default = () => (
  <MemberAddModal
    title="프로젝트 멤버 초대하기"
    onClose={() => {
      console.log('close');
    }}
    onSubmit={(data) => {
      console.log(data);
    }}
  />
);
