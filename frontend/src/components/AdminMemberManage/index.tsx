import { useState } from 'react';
import AdminMemberManageForm from './AdminMemberManageForm';
import { useParams } from 'react-router-dom';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';
import useAuthStore from '@/stores/useAuthStore';
import useAddProjectMemberQuery from '@/queries/projects/useAddProjectMemberQuery';
import MemberAddModal from '../MemberAddModal';
import { MemberAddFormValues } from '../MemberAddModal/MemberAddForm';

export default function AdminMemberManage() {
  const { projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: members = [] } = useProjectMembersQuery(Number(projectId), memberId);
  const addProjectMember = useAddProjectMemberQuery();

  const [, setInviteModalOpen] = useState(false);

  const handleMemberInvite = (data: MemberAddFormValues) => {
    addProjectMember.mutate({
      projectId: Number(projectId),
      memberId: memberId,
      newMember: {
        // Todo : 멤버 id로 수정하는 로직 수정해야한다.
        // memberId: data.email,
        memberId: 0,
        privilegeType: data.role,
      },
    });
    console.log('Invited:', data);
    setInviteModalOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-6 border-b-[0.67px] border-[#dcdcde] bg-[#fbfafd] p-6">
      <header className="flex w-full items-center gap-4">
        <h1 className="flex-1 text-lg font-semibold text-[#333238]">멤버 관리</h1>
        <MemberAddModal onSubmit={handleMemberInvite} />
      </header>

      <AdminMemberManageForm members={members} />
    </div>
  );
}
