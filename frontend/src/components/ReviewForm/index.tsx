import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageSelection from '@/components/ImageSelection';
import { useForm } from 'react-hook-form';

interface ReviewFormProps {
  projects: { id: string; title: string }[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
  onSubmit: (data: { title: string; content: string }) => void;
}

export default function ReviewForm({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  selectedImages,
  setSelectedImages,
  onSubmit,
}: ReviewFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string; content: string }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label htmlFor="project">프로젝트 선택</Label>
        <Select onValueChange={(value) => setSelectedProjectId(value)}>
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
      </div>

      <div className="mb-4">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="리뷰 제목을 입력하세요"
          {...register('title', { required: '제목을 입력해주세요.' })}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          placeholder="리뷰 내용을 입력하세요"
          {...register('content', { required: '내용을 입력해주세요.' })}
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
    </form>
  );
}
