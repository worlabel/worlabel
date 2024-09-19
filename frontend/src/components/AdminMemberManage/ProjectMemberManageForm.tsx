import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useUpdateProjectMemberPrivilegeQuery from '@/queries/projects/useUpdateProjectMemberPrivilegeQuery';
import useProjectMembersQuery from '@/queries/projects/useProjectMembersQuery';
import useAuthStore from '@/stores/useAuthStore';

type Role = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';

const roles: Role[] = ['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER'];

const roleToStr: { [key in Role]: string } = {
  ADMIN: '관리자',
  MANAGER: '매니저',
  EDITOR: '에디터',
  VIEWER: '뷰어',
};

const formSchema = z.object({
  members: z.array(
    z.object({
      memberId: z.number(),
      nickname: z.string().nonempty('닉네임을 입력하세요.'),
      role: z.enum(roles as [Role, ...Role[]], { errorMap: () => ({ message: '역할을 선택해주세요.' }) }),
    })
  ),
});

export type ProjectMemberManageFormValues = z.infer<typeof formSchema>;

export default function ProjectMemberManageForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectId');
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;

  const { data: members = [] } = useProjectMembersQuery(Number(projectId), memberId);
  const { mutate: updatePrivilege } = useUpdateProjectMemberPrivilegeQuery();

  const form = useForm<ProjectMemberManageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: members.map((m) => ({
        memberId: m.memberId,
        nickname: m.nickname,
        role: m.privilegeType as Role,
      })),
    },
  });

  const handleRoleChange = (memberId: number, role: Role) => {
    updatePrivilege({
      projectId: Number(projectId),
      memberId,
      privilegeData: {
        memberId,
        privilegeType: role,
      },
    });
  };

  return (
    <Form {...form}>
      <div className="flex w-full flex-col gap-4">
        {members.map((member, index) => (
          <div
            key={member.memberId}
            className="flex items-center gap-4"
          >
            <FormField
              name={`members.${index}.nickname`}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="닉네임을 입력하세요."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={`members.${index}.role`}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleRoleChange(member.memberId, value as Role);
                      }}
                      defaultValue={field.value}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </Form>
  );
}
