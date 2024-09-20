interface WorkspaceMember {
  memberId: number;
  nickname: string;
  profileImage: string;
}

interface WorkspaceMemberManageFormProps {
  members: WorkspaceMember[];
}

export default function WorkspaceMemberManageForm({ members }: WorkspaceMemberManageFormProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {members.length === 0 ? (
        <div className="py-4 text-center">워크스페이스에 멤버가 없습니다.</div>
      ) : (
        members.map((member) => (
          <div
            key={member.memberId}
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
