import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Role = 'admin' | 'manager' | 'editor' | 'viewer';

const roles: Role[] = ['admin', 'manager', 'editor', 'viewer'];

const roleToStr: { [key in Role]: string } = {
  admin: '관리자',
  manager: '매니저',
  editor: '에디터',
  viewer: '뷰어',
};

const formSchema = z.object({
  members: z.array(
    z.object({
      email: z.string().email({ message: '올바른 이메일 형식을 입력해주세요.' }),
      role: z.enum(roles as [Role, ...Role[]], { errorMap: () => ({ message: '역할을 선택해주세요.' }) }),
    })
  ),
});

export type MemberManageFormValues = z.infer<typeof formSchema>;

interface Member {
  email: string;
  role: Role;
}

interface MemberManageFormProps {
  members: Member[];
  onSubmit: (data: MemberManageFormValues) => void;
}

export default function MemberManageForm({ members, onSubmit }: MemberManageFormProps) {
  const form = useForm<MemberManageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { members },
  });

  const groupedMembers = members.reduce<{ [key: string]: { email: string; role: Role }[] }>((acc, member) => {
    if (!acc[member.role]) acc[member.role] = [];
    acc[member.role].push(member);
    return acc;
  }, {});

  const roleOrder: Role[] = ['admin', 'manager', 'editor', 'viewer'];

  const sortedGroupedMembers = Object.entries(groupedMembers).sort(
    ([roleA], [roleB]) => roleOrder.indexOf(roleA as Role) - roleOrder.indexOf(roleB as Role)
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex w-[530px] flex-col gap-[var(--size-space-200)]">
          {sortedGroupedMembers.map(([role, groupMembers]) => {
            if (!groupMembers || groupMembers.length === 0) return null;

            return (
              <div
                key={role}
                className="flex flex-col gap-3"
              >
                <FormLabel className="body-strong">{roleToStr[role as Role]}</FormLabel>
                {groupMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 ${index === groupMembers.length - 1 ? 'mb-4' : ''}`}
                  >
                    <FormField
                      name={`members.${members.findIndex((m) => m.email === member.email)}.email`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`members.${members.findIndex((m) => m.email === member.email)}.role`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
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
            );
          })}
        </div>

        <Button
          type="submit"
          variant="outlinePrimary"
          disabled={!form.formState.isValid}
        >
          역할 설정
        </Button>
      </form>
    </Form>
  );
}
