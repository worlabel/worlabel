import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select } from '../ui/select';

const formSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식을 입력해주세요.' }),
  role: z.string().min(1, { message: '역할을 선택해주세요.' }),
});

export type MemberAddFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<MemberAddFormValues> = {
  email: '',
  role: '',
};

const roleOptions = [
  { value: 'admin', label: '관리자' },
  { value: 'viewer', label: '뷰어' },
  { value: 'editor', label: '에디터' },
];

export default function MemberAddForm({ onSubmit }: { onSubmit: (data: MemberAddFormValues) => void }) {
  const form = useForm<MemberAddFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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
                <Input
                  placeholder="이메일을 입력해주세요."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">역할</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  options={roleOptions}
                />
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
