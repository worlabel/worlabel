import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Role = 'admin' | 'editor' | 'viewer';

const roles: Role[] = ['admin', 'editor', 'viewer'];

const roleToStr: { [key in Role]: string } = {
  admin: '관리자',
  editor: '사용자',
  viewer: '뷰어',
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
  role: z.enum(['admin', 'editor', 'viewer']),
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
                  placeholder="초대할 멤버의 이메일 주소를 입력해주세요."
                  maxLength={40}
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="초대할 멤버의 역할을 선택해주세요." />
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
