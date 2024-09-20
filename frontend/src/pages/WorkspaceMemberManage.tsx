import { useParams } from 'react-router-dom';
import useWorkspaceMembersQuery from '@/queries/workspaces/useWorkspaceMembersQuery';
import useAuthStore from '@/stores/useAuthStore';
import WorkspaceMemberAddModal from '@/components/WorkspaceMemberAddModal';

export default function WorkspaceMemberManage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: members = [] } = useWorkspaceMembersQuery(Number(workspaceId));

  return (
    <div className="flex w-full flex-col gap-6 border-b-[0.67px] border-[#dcdcde] bg-[#fbfafd] p-6">
      <header className="flex w-full items-center gap-4">
        <h1 className="flex-1 text-lg font-semibold text-[#333238]">워크스페이스 멤버 관리</h1>
        <WorkspaceMemberAddModal
          workspaceId={Number(workspaceId)}
          memberId={memberId}
        />
      </header>

      {members.length === 0 ? (
        <div className="py-4 text-center">워크스페이스에 멤버가 없습니다.</div>
      ) : (
        members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 border-b pb-2"
          >
            <img
              src={member.profileImage}
              alt={member.nickname}
              className="h-8 w-8 rounded-full"
            />
            <span>{member.nickname}</span>
          </div>
        ))
      )}
    </div>
  );
}
