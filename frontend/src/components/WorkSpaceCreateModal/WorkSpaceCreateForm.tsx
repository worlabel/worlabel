import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const formSchema = z.object({
  workspaceName: z.string().max(50).min(1, {
    message: '이름을 입력해주세요.',
  }),
  workspaceDescription: z.string().max(200).optional(),
});

export type WorkSpaceCreateFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<WorkSpaceCreateFormValues> = {
  workspaceName: '',
  workspaceDescription: '',
};

interface WorkSpaceCreateFormProps {
  onSubmit: (data: WorkSpaceCreateFormValues) => void;
}

export default function WorkSpaceCreateForm({ onSubmit }: WorkSpaceCreateFormProps) {
  const form = useForm<WorkSpaceCreateFormValues>({
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
          name="workspaceName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">워크스페이스 이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="이름을 입력해주세요."
                  maxLength={50}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="workspaceDescription"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">워크스페이스 설명</FormLabel>
              <FormControl>
                <Input
                  placeholder="워크스페이스 설명을 입력해주세요."
                  maxLength={200}
                  {...field}
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
          워크스페이스 만들기
        </Button>
      </form>
    </Form>
  );
}
