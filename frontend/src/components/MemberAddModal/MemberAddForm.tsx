import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchInput from '../ui/search-input';
import useSearchMembersByEmailQuery from '@/queries/members/useSearchMembersByEmailQuery';

type PrivilegeType = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';

const privilegeTypes: readonly ['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER'] = ['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER'];

const privilegeTypeToStr: { [key in PrivilegeType]: string } = {
  ADMIN: '관리자',
  MANAGER: '매니저',
  EDITOR: '에디터',
  VIEWER: '뷰어',
};

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: '올바른 이메일 형식을 입력해주세요.',
    })
    .max(40)
    .min(1, {
      message: '초대할 멤버의 이메일 주소를 입력해주세요.',
    }),
  role: z.enum(privilegeTypes),
});

export type MemberAddFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<MemberAddFormValues> = {
  email: '',
  role: undefined,
};

export default function MemberAddForm({ onSubmit }: { onSubmit: (data: MemberAddFormValues) => void }) {
  const form = useForm<MemberAddFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [keyword, setKeyword] = useState('');
  const { data: members } = useSearchMembersByEmailQuery(keyword);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">이메일</FormLabel>
              <FormControl>
                <SearchInput
                  placeholder="초대할 멤버의 이메일을 검색하세요."
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    setKeyword(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {members && (
          <ul className="mt-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="py-1"
              >
                <img
                  src={member.profileImage}
                  alt={member.nickname}
                  className="h-8 w-8 rounded-full"
                />
                <span className="ml-2">
                  {member.nickname} ({member.email})
                </span>
              </li>
            ))}
          </ul>
        )}

        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">역할</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="초대할 멤버의 역할을 선택해주세요." />
                  </SelectTrigger>
                  <SelectContent>
                    {privilegeTypes.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                      >
                        {privilegeTypeToStr[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outlinePrimary"
          disabled={!form.formState.isValid}
        >
          멤버 초대하기
        </Button>
      </form>
    </Form>
  );
}
