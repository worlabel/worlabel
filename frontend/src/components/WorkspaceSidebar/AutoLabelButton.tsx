import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Play } from 'lucide-react';
import { Button } from '../ui/button';
import useAutoLabelQuery from '@/queries/projects/useAutoLabelQuery';
import { useQueryClient } from '@tanstack/react-query';
import useProjectModelsQuery from '@/queries/models/useProjectModelsQuery';
import { useId, useRef } from 'react';

export default function AutoLabelButton({ projectId }: { projectId: number }) {
  const { data: modelData } = useProjectModelsQuery(projectId);
  const queryClient = useQueryClient();
  const requestAutoLabel = useAutoLabelQuery();
  const { toast } = useToast();
  const id = useId();
  const modelRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center gap-1.5">
        <label
          htmlFor={id}
          className="body-small shrink-0"
        >
          모델
        </label>
        <select
          id={id}
          ref={modelRef}
          className="body-small w-full cursor-pointer rounded border border-gray-300 bg-gray-50 p-1"
          defaultValue={modelData.filter((model) => model.isDefault)[0].id}
        >
          {modelData?.map((model) => (
            <option
              key={model.id}
              value={model.id}
            >
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="blue"
        className="w-full overflow-hidden"
        disabled={requestAutoLabel.isPending}
        onClick={() => {
          requestAutoLabel.mutate(
            { projectId: projectId, modelId: parseInt(modelRef.current?.value || '1') },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['folder', projectId.toString()] });
                queryClient.invalidateQueries({ queryKey: ['labelJson'] });
                toast({ title: '레이블링 성공', duration: 1500 });
              },
              onError: () => {
                toast({ title: '레이블링 중 오류가 발생했습니다.', duration: 1500 });
              },
            }
          );
        }}
      >
        {requestAutoLabel.isPending ? (
          <LoaderCircle
            size={16}
            className="animate-spin"
          />
        ) : (
          <>
            <Play
              size={16}
              className="mr-1 shrink-0"
            />
            <span>자동 레이블링</span>
          </>
        )}
      </Button>
    </div>
  );
}
