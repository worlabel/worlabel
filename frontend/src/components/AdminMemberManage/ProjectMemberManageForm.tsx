import { useLocation, useParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useUpdateProjectMemberPrivilegeQuery from '@/queries/projects/useUpdateProjectMemberPrivilegeQuery';
import useRemoveProjectMemberQuery from '@/queries/projects/useRemoveProjectMemberQuery';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';
import useWorkspaceMembersQuery from '@/queries/workspaces/useWorkspaceMembersQuery';
import useAuthStore from '@/stores/useAuthStore';
import useAddProjectMemberQuery from '@/queries/projects/useAddProjectMemberQuery';

type Role = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER' | 'NONE';

const roles: Role[] = ['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER', 'NONE'];

const roleToStr: { [key in Role]: string } = {
  ADMIN: '관리자',
  MANAGER: '매니저',
  EDITOR: '에디터',
  VIEWER: '뷰어',
  NONE: '역할 없음',
};

export default function ProjectMemberManageForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectId');
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: workspaceMembers = [] } = useWorkspaceMembersQuery(Number(workspaceId));
  const { data: projectMembers = [] } = useProjectMembersQuery(Number(projectId), memberId);
  const { mutate: updatePrivilege } = useUpdateProjectMemberPrivilegeQuery();
  const { mutate: removeMember } = useRemoveProjectMemberQuery();
  const { mutate: addProjectMember } = useAddProjectMemberQuery();

  const noRoleMembers = workspaceMembers
    .filter((workspaceMember) => !projectMembers.some((projectMember) => projectMember.memberId === workspaceMember.id))
    .map((member) => ({
      memberId: member.id,
      nickname: member.nickname,
      profileImage: member.profileImage,
      privilegeType: 'NONE',
    }));

  const sortedMembers = [...projectMembers, ...noRoleMembers].sort((a, b) => {
    const aPrivilege = a.privilegeType || 'NONE';
    const bPrivilege = b.privilegeType || 'NONE';
    return roles.indexOf(aPrivilege as Role) - roles.indexOf(bPrivilege as Role);
  });

  const handleRoleChange = (memberId: number, role: Role) => {
    if (role === 'NONE') {
      removeMember({
        projectId: Number(projectId),
        targetMemberId: memberId,
      });
    } else {
      if (projectMembers.some((m) => m.memberId === memberId)) {
        updatePrivilege({
          projectId: Number(projectId),
          memberId,
          privilegeData: {
            memberId,
            privilegeType: role,
          },
        });
      } else {
        addProjectMember({
          projectId: Number(projectId),
          memberId,
          newMember: {
            memberId,
            privilegeType: role,
          },
        });
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {sortedMembers.map((member) => (
        <div
          key={`${member.memberId}-${member.nickname}`}
          className="flex items-center gap-4"
        >
          <span className="flex-1">{member.nickname}</span>
          <div className="flex-1">
            <Select
              onValueChange={(value) => handleRoleChange(member.memberId, value as Role)}
              defaultValue={member.privilegeType || 'NONE'}
              disabled={member.privilegeType === 'ADMIN'}
            >
              <SelectTrigger>
                <SelectValue placeholder="역할을 선택해주세요." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    disabled={role === 'ADMIN'}
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
