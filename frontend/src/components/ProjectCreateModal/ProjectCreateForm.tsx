import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';

const formSchema = z.object({
  projectName: z.string().max(50).min(1, {
    message: '이름을 입력해주세요.',
  }),
  labelType: z.enum(['Classification', 'Detection', 'Segmentation']),
  categories: z.array(z.string()).min(1, {
    message: '카테고리를 하나 이상 입력해주세요.',
  }),
});

export type ProjectCreateFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<ProjectCreateFormValues> = {
  projectName: '',
  labelType: 'Classification',
};

export default function ProjectCreateForm({ onSubmit }: { onSubmit: (data: ProjectCreateFormValues) => void }) {
  const [categories, setCategories] = useState<string[]>([]);
  const form = useForm<ProjectCreateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, categories },
  });
  const categoryRef = useRef<HTMLInputElement>(null);
  const handleAddCategory = (event: React.MouseEvent<HTMLButtonElement>, onChange: (value: string[]) => void) => {
    event.preventDefault();

    const category = categoryRef.current?.value;
    if (!category) return;

    const newCategories = [...categories, category];

    if (!categories.includes(category)) {
      onChange(newCategories);
      setCategories(newCategories);
    }
    categoryRef.current!.value = '';
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5 overflow-x-auto p-1"
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
        <FormField
          name="categories"
          render={({ field }) => (
            <div className="mb-1 flex w-full flex-col gap-2">
              <div className="body-strong">카테고리</div>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    ref={categoryRef}
                    placeholder="카테고리를 추가해주세요."
                  />
                </FormControl>
                <Button
                  variant="blue"
                  onClick={(event) => handleAddCategory(event, field.onChange)}
                >
                  추가
                </Button>
              </div>
              {categories.length > 0 && (
                <div className="flex w-full flex-col overflow-x-auto">
                  <div className="flex gap-2 py-1">
                    {categories.map((category: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full border-2 border-gray-700 px-2 py-1 text-gray-700"
                      >
                        <span>{category}</span>
                        <X
                          size={16}
                          className="cursor-pointer"
                          onClick={() => {
                            const newCategories = categories.filter((_, i) => i !== index);
                            field.onChange(newCategories);
                            setCategories(newCategories);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormMessage />
            </div>
          )}
        />
        <Button
          type="submit"
          variant="blue"
          disabled={!form.formState.isValid}
        >
          프로젝트 만들기
        </Button>
      </form>
    </Form>
  );
}
