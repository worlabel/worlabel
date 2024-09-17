import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  projectName: z.string().max(50).min(1, {
    message: '이름을 입력해주세요.',
  }),
  labelType: z.enum(['Classification', 'Detection', 'Segmentation']),
});

export type ProjectCreateFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<ProjectCreateFormValues> = {
  projectName: '',
  labelType: 'Classification',
};

export default function ProjectCreateForm({ onSubmit }: { onSubmit: (data: ProjectCreateFormValues) => void }) {
  const form = useForm<ProjectCreateFormValues>({
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
          name="projectName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">이름</FormLabel>
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
          name="labelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-strong">레이블 종류</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-5"
              >
                {['Classification', 'Detection', 'Segmentation'].map((labelType) => (
                  <FormItem
                    key={labelType}
                    className="flex w-full items-center justify-center"
                  >
                    <FormLabel className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-gray-500 transition-colors [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-gray-50">
                      <FormControl>
                        <RadioGroupItem
                          value={labelType}
                          className="sr-only"
                        />
                      </FormControl>
                      <span>{labelType}</span>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outlinePrimary"
          disabled={!form.formState.isValid}
        >
          프로젝트 만들기
        </Button>
      </form>
    </Form>
  );
}
