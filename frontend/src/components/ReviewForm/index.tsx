import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageSelection from '@/components/ImageSelection';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ReviewFormProps {
  projects: { id: string; title: string }[];
  onSubmit: (data: ReviewFormData) => void;
}

const reviewFormSchema = z.object({
  projectId: z.string().min(1, '프로젝트를 선택해주세요.'),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  imageIds: z.array(z.number()),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function ReviewForm({ projects, onSubmit }: ReviewFormProps): JSX.Element {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      projectId: '',
      title: '',
      content: '',
      imageIds: [],
    },
  });

  const selectedProjectId = watch('projectId');
  const selectedImages = watch('imageIds');

  const setSelectedProjectId = (value: string) => {
    setValue('projectId', value);
    setValue('imageIds', []); // 프로젝트 변경 시 이미지 초기화
  };

  const setSelectedImages = (images: number[]) => {
    setValue('imageIds', images);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label htmlFor="project">프로젝트 선택</Label>
        <Select onValueChange={setSelectedProjectId}>
          <SelectTrigger id="project">
            <SelectValue placeholder="프로젝트를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {projects.length ? (
              projects.map((project) => (
                <SelectItem
                  key={project.id}
                  value={project.id}
                >
                  {project.title}
                </SelectItem>
              ))
            ) : (
              <SelectItem
                disabled
                value={'true'}
              >
                프로젝트가 없습니다
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.projectId && <p className="text-red-500">{errors.projectId.message}</p>}
      </div>

      <div className="mb-4">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="리뷰 제목을 입력하세요"
          {...register('title')}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          placeholder="리뷰 내용을 입력하세요"
          className="ring-black"
          {...register('content')}
        />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
      </div>

      {selectedProjectId && (
        <ImageSelection
          projectId={selectedProjectId}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      )}
      {errors.imageIds && errors.imageIds.message && <p className="text-red-500">{errors.imageIds.message}</p>}

      <div className="actions mt-6 flex justify-end space-x-2">
        <Button
          variant="red"
          type="button"
          onClick={() => navigate(-1)}
        >
          취소
        </Button>
        <Button
          variant="black"
          type="submit"
        >
          리뷰 요청
        </Button>
      </div>
    </form>
  );
}
