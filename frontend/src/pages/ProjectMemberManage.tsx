import { useParams } from 'react-router-dom';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';
import useWorkspaceMembersQuery from '@/queries/workspaces/useWorkspaceMembersQuery';
import useAuthStore from '@/stores/useAuthStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUpdateProjectMemberPrivilegeQuery from '@/queries/projects/useUpdateProjectMemberPrivilegeQuery';
import useRemoveProjectMemberQuery from '@/queries/projects/useRemoveProjectMemberQuery';
import useAddProjectMemberQuery from '@/queries/projects/useAddProjectMemberQuery';
import { useEffect, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import MemberAddModal from '@/components/MemberAddModal';
import useIsAdminOrManager from '@/hooks/useIsAdminOrManager';

type Role = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER' | 'NONE';
const roles: Role[] = ['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER', 'NONE'];
const roleToStr: { [key in Role]: string } = {
  ADMIN: '관리자',
  MANAGER: '매니저',
  EDITOR: '에디터',
  VIEWER: '뷰어',
  NONE: '역할 없음',
};

export default function ProjectMemberManage() {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const queryClient = useQueryClient();
  const previousProjectId = useRef(projectId);

  const { data: projectMembers = [] } = useProjectMembersQuery(Number(projectId), memberId);
  const { data: workspaceMembers = [] } = useWorkspaceMembersQuery(Number(workspaceId));

  const isAdminOrManager = useIsAdminOrManager(Number(projectId));

  const updatePrivilege = useUpdateProjectMemberPrivilegeQuery();
  const removeMember = useRemoveProjectMemberQuery();
  const addProjectMember = useAddProjectMemberQuery();

  useEffect(() => {
    if (projectId && previousProjectId.current !== projectId) {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', Number(previousProjectId.current), memberId] });
      queryClient.invalidateQueries({ queryKey: ['workspaceMembers', Number(workspaceId)] });
      queryClient.invalidateQueries({ queryKey: ['projectMembers', Number(projectId), memberId] });

      previousProjectId.current = projectId;
    }
  }, [projectId, workspaceId, memberId, queryClient]);

  const sortedMembers = useMemo(() => {
    const noRoleMembers = workspaceMembers
      .filter(
        (workspaceMember) => !projectMembers.some((projectMember) => projectMember.memberId === workspaceMember.id)
      )
      .map((member) => ({
        memberId: member.id,
        nickname: member.nickname,
        profileImage: member.profileImage,
        privilegeType: 'NONE',
      }));

    return [...projectMembers, ...noRoleMembers].sort((a, b) => {
      const aPrivilege = a.privilegeType || 'NONE';
      const bPrivilege = b.privilegeType || 'NONE';
      return roles.indexOf(aPrivilege as Role) - roles.indexOf(bPrivilege as Role);
    });
  }, [projectMembers, workspaceMembers]);

  const handleRoleChange = (memberId: number, role: Role) => {
    if (role === 'NONE') {
      removeMember.mutate({ projectId: Number(projectId), targetMemberId: memberId });
    } else {
      if (projectMembers.some((m) => m.memberId === memberId)) {
        updatePrivilege.mutate({
          projectId: Number(projectId),
          memberId,
          privilegeType: role, // 수정: privilegeData 대신 privilegeType만 전달
        });
      } else {
        addProjectMember.mutate({
          projectId: Number(projectId),
          memberId,
          newMember: { memberId, privilegeType: role },
        });
      }
    }
  };

  return (
    <div className="grid w-full">
      <div className="flex flex-col gap-4 p-4">
        <header className="bg-background flex items-center">
          <h1 className="heading flex-1">프로젝트 멤버 관리</h1>
          {isAdminOrManager && <MemberAddModal projectId={projectId ? Number(projectId) : 0} />}
        </header>

        <main className="grid flex-1 gap-4 overflow-auto">
          {sortedMembers.length === 0 ? (
            <div className="py-4 text-center">프로젝트에 멤버가 없습니다.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedMembers.map((member) => (
                <div
                  key={`${member.memberId}-${member.privilegeType}`}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <img
                    src={member.profileImage}
                    alt={member.nickname}
                    className="h-12 w-12 rounded-full"
                  />
                  <span className="flex-1 text-lg font-medium">{member.nickname}</span>
                  <div className="flex-1">
                    <Select
                      onValueChange={(value) => handleRoleChange(member.memberId, value as Role)}
                      defaultValue={member.privilegeType}
                      disabled={!isAdminOrManager || member.privilegeType === 'ADMIN'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="역할을 선택하세요" />
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
          )}
        </main>
      </div>
    </div>
  );
}
