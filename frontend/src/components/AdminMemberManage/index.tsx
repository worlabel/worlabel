import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import useAddWorkspaceMemberQuery from '@/queries/workspaces/useAddWorkspaceMemberQuery';
import useAddProjectMemberQuery from '@/queries/projects/useAddProjectMemberQuery';
import useWorkspaceMembersQuery from '@/queries/workspaces/useWorkspaceMembersQuery';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';
import MemberAddModal from '../MemberAddModal';
import { MemberAddFormValues } from '../MemberAddModal/MemberAddForm';
import WorkspaceMemberManageForm from './WorkspaceMemberManageForm';
import ProjectMemberManageForm from './ProjectMemberManageForm';

export default function AdminMemberManage() {
  const { workspaceId, projectId } = useParams<{ workspaceId?: string; projectId?: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const [, setInviteModalOpen] = useState(false);

  const handleMemberInvite = (data: MemberAddFormValues) => {
    if (workspaceId) {
      const addWorkspaceMember = useAddWorkspaceMemberQuery();
      addWorkspaceMember.mutate({
        workspaceId: Number(workspaceId),
        memberId: memberId,
        newMember: {
          memberId: 0,
          privilegeType: data.role,
        },
      });
    } else if (projectId) {
      const addProjectMember = useAddProjectMemberQuery();
      addProjectMember.mutate({
        projectId: Number(projectId),
        memberId: memberId,
        newMember: {
          memberId: 0,
          privilegeType: data.role,
        },
      });
    }
    setInviteModalOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-6 border-b-[0.67px] border-[#dcdcde] bg-[#fbfafd] p-6">
      <header className="flex w-full items-center gap-4">
        <h1 className="flex-1 text-lg font-semibold text-[#333238]">멤버 관리</h1>
        <MemberAddModal onSubmit={handleMemberInvite} />
      </header>

      {workspaceId && <WorkspaceMemberManageForm members={useWorkspaceMembersQuery(Number(workspaceId)).data || []} />}
      {projectId && (
        <ProjectMemberManageForm members={useProjectMembersQuery(Number(projectId), memberId).data || []} />
      )}
    </div>
  );
}
