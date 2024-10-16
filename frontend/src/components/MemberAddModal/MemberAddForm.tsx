import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchInput from '../ui/search-input';
import useSearchMembersByEmailQuery from '@/queries/members/useSearchMembersByEmailQuery';
import debounce from 'lodash/debounce';

type PrivilegeType = 'MANAGER' | 'EDITOR' | 'VIEWER'; // ADMIN을 제외
const privilegeTypes: readonly ['MANAGER', 'EDITOR', 'VIEWER'] = ['MANAGER', 'EDITOR', 'VIEWER']; // ADMIN을 제외

const privilegeTypeToStr: { [key in PrivilegeType]: string } = {
  MANAGER: '매니저',
  EDITOR: '에디터',
  VIEWER: '뷰어',
};

const formSchema = z.object({
  memberId: z.number().nonnegative({ message: '멤버를 선택하세요.' }),
  role: z.enum(privilegeTypes, { errorMap: () => ({ message: '역할을 선택하세요.' }) }),
});

export type MemberAddFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<MemberAddFormValues> = {
  memberId: 0,
  role: undefined,
};

export default function MemberAddForm({ onSubmit }: { onSubmit: (data: MemberAddFormValues) => void }) {
  const form = useForm<MemberAddFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const { data: members } = useSearchMembersByEmailQuery(debouncedKeyword);

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const handleKeywordChange = debounce((value: string) => {
    setDebouncedKeyword(value);
  }, 300);

  useEffect(() => {
    handleKeywordChange(keyword);
    return () => {
      handleKeywordChange.cancel();
    };
  }, [handleKeywordChange, keyword]);

  const handleMemberSelect = (memberId: number) => {
    form.setValue('memberId', memberId);
    setSelectedMemberId(memberId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormItem>
          <FormLabel className="body-strong">이메일</FormLabel>
          <FormControl>
            <SearchInput
              placeholder="초대할 멤버의 이메일을 검색하세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {members && (
          <ul className="mt-2">
            {members.map((member) => (
              <li
                key={member.id}
                className={`cursor-pointer rounded-md px-2 py-1 transition-all ${
                  selectedMemberId === member.id ? 'border-2 border-blue-400 bg-blue-200' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleMemberSelect(member.id)}
              >
                <img
                  src={member.profileImage}
                  alt={member.nickname}
                  className="inline h-8 w-8 rounded-full"
                />
                <span className="ml-2">
                  {member.nickname} ({member.email})
                </span>
              </li>
            ))}
          </ul>
        )}

        <Controller
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">역할</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
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
          variant="blue"
          disabled={!form.formState.isValid || !form.getValues('memberId')}
        >
          멤버 초대하기
        </Button>
      </form>
    </Form>
  );
}
