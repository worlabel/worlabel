import { useLocation } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useUpdateProjectMemberPrivilegeQuery from '@/queries/projects/useUpdateProjectMemberPrivilegeQuery';
import useRemoveProjectMemberQuery from '@/queries/projects/useRemoveProjectMemberQuery';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';
import useAuthStore from '@/stores/useAuthStore';

type Role = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER' | 'NONE';

const roles: Role[] = ['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER', 'NONE'];

const roleToStr: { [key in Role]: string } = {
  ADMIN: '관리자',
  MANAGER: '매니저',
  EDITOR: '에디터',
  VIEWER: '뷰어',
  NONE: '역할 없음',
};

interface ProjectMemberManageFormProps {
  workspaceMembers: Array<{ memberId: number; nickname: string }>;
}

export default function ProjectMemberManageForm({ workspaceMembers }: ProjectMemberManageFormProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectId');
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: projectMembers = [] } = useProjectMembersQuery(Number(projectId), memberId);
  const { mutate: updatePrivilege } = useUpdateProjectMemberPrivilegeQuery();
  const { mutate: removeMember } = useRemoveProjectMemberQuery();

  const noRoleMembers = workspaceMembers.filter((wm) => !projectMembers.some((pm) => pm.memberId === wm.memberId));

  const handleRoleChange = (memberId: number, role: Role) => {
    if (role === 'NONE') {
      removeMember({
        projectId: Number(projectId),
        memberId: memberId,
        targetMemberId: memberId,
      });
    } else {
      updatePrivilege({
        projectId: Number(projectId),
        memberId,
        privilegeData: {
          memberId,
          privilegeType: role,
        },
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {[...projectMembers, ...noRoleMembers].map((member) => (
        <div
          key={member.memberId}
          className="flex items-center gap-4"
        >
          <span className="flex-1">{member.nickname}</span>
          <div className="flex-1">
            <Select
              onValueChange={(value) => handleRoleChange(member.memberId, value as Role)}
              defaultValue={projectMembers.find((m) => m.memberId === member.memberId)?.privilegeType || 'NONE'}
              disabled={projectMembers.some((m) => m.memberId === member.memberId && m.privilegeType === 'ADMIN')}
            >
              <SelectTrigger>
                <SelectValue placeholder="역할을 선택해주세요." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                  >
                    {roleToStr[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}
