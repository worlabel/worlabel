import useWorkspaceMembersQuery from '@/queries/workspaces/useWorkspaceMembersQuery';
import { useParams } from 'react-router-dom';

export default function WorkspaceMemberManageForm() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: members = [] } = useWorkspaceMembersQuery(Number(workspaceId));

  return (
    <div className="flex w-full flex-col gap-4">
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
