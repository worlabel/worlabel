import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import SearchInput from '../ui/search-input';
import useSearchMembersByEmailQuery from '@/queries/members/useSearchMembersByEmailQuery';

const formSchema = z.object({
  memberId: z.number().nonnegative({ message: '멤버를 선택하세요.' }),
});

export type MemberAddFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<MemberAddFormValues> = {
  memberId: 0,
};

export default function MemberAddForm({ onSubmit }: { onSubmit: (data: MemberAddFormValues) => void }) {
  const form = useForm<MemberAddFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [keyword, setKeyword] = useState('');
  const { data: members } = useSearchMembersByEmailQuery(keyword);

  const handleMemberSelect = (memberId: number) => {
    form.setValue('memberId', memberId);
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
                className={`cursor-pointer rounded-md px-3 py-2 ${
                  form.watch('memberId') === member.id ? 'bg-blue-100' : 'hover:bg-gray-100'
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

        <Button
          type="submit"
          variant="outlinePrimary"
          disabled={form.watch('memberId') === 0}
        >
          멤버 초대하기
        </Button>
      </form>
    </Form>
  );
}
