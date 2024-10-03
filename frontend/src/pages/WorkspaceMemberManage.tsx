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
    <div className="grid w-full">
      <div className="flex flex-col">
        <header className="bg-background flex h-16 items-center gap-4 px-4">
          <h1 className="heading flex-1">워크스페이스 멤버 관리</h1>

          <WorkspaceMemberAddModal
            workspaceId={Number(workspaceId)}
            memberId={memberId}
          />
        </header>

        <main className="flex-1 overflow-auto px-4 pb-4">
          {members.length === 0 ? (
            <div className="py-4 text-center">워크스페이스에 멤버가 없습니다.</div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex w-full items-center gap-4 rounded-lg border p-2 md:w-1/2 lg:w-2/5"
                >
                  <img
                    src={member.profileImage}
                    alt={member.nickname}
                    className="h-12 w-12 rounded-full"
                  />
                  <span className="flex-1 text-sm font-medium">{member.nickname}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
