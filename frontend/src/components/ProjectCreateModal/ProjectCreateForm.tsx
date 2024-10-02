import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { cn } from '@/lib/utils';

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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const form = useForm<ProjectCreateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, categories },
  });
  const categoryRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string[]) => void) => {
    event.preventDefault();

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const newCategories = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (newCategories.length > 0) {
        const uniqueCategories = Array.from(new Set([...categories, ...newCategories]));
        onChange(uniqueCategories);
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('파일을 읽는 중 오류가 발생했습니다:', error);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, onChange: (value: string[]) => void) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const newCategories = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (newCategories.length > 0) {
        const uniqueCategories = Array.from(new Set([...categories, ...newCategories]));
        onChange(uniqueCategories);
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('파일을 읽는 중 오류가 발생했습니다:', error);
    }
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
              <Tabs defaultValue="manual">
                <TabsList className="mb-4">
                  <TabsTrigger value="manual">직접 입력</TabsTrigger>
                  <TabsTrigger value="file">파일로 입력</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                  <div className="mt-2 flex gap-2">
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
                </TabsContent>
                <TabsContent value="file">
                  <div
                    className={cn(
                      'mt-2 flex w-full items-center justify-center rounded-lg border-2 border-dashed p-5 text-center transition-colors',
                      isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-100'
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(event) => handleDrop(event, field.onChange)}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="text-gray-500">
                      파일을 업로드하려면 여기를 클릭하거나 파일을 드래그하여 여기에 놓으세요.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".txt"
                      onChange={(event) => handleFileUpload(event, field.onChange)}
                      className="hidden"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              {categories.length > 0 && (
                <div className="flex w-full flex-col overflow-x-auto">
                  <div className="flex gap-2 py-1">
                    {categories.map((category: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-blue-500 py-1 pl-3 pr-2 text-white"
                      >
                        <span className="body-small">{category}</span>
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
