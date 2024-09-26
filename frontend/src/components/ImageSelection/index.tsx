// ImageSelection.tsx
import { Label } from '@/components/ui/label';
import useRecursiveSavedImages from '@/hooks/useRecursiveSavedImages';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageSelectionProps {
  projectId: string;
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function ImageSelection({ projectId, selectedImages, setSelectedImages }: ImageSelectionProps) {
  const { allSavedImages } = useRecursiveSavedImages(projectId, 0);

  const handleImageSelect = (imageId: number) => {
    // 상태 업데이트 안전하게 관리
    setSelectedImages((prevSelectedImages) => {
      // 이미 선택된 이미지가 있는 경우 필터링하여 제거
      if (prevSelectedImages.includes(imageId)) {
        return prevSelectedImages.filter((id) => id !== imageId);
      }
      // 선택되지 않은 이미지를 배열에 추가
      return [...prevSelectedImages, imageId];
    });
  };

  return (
    <div className="mb-4">
      <Label>이미지 선택 (파일 목록)</Label>
      <ScrollArea className="max-h-64 overflow-auto border p-2">
        <ul className="space-y-2">
          {allSavedImages && allSavedImages.length > 0 ? (
            allSavedImages.map((image) => (
              <li
                key={image.id}
                className={`relative flex items-center justify-between border p-2 ${
                  selectedImages.includes(image.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <span className="truncate">{image.imageTitle}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedImages.includes(image.id) ? 'destructive' : 'outline'}
                    size="xs"
                    onClick={() => handleImageSelect(image.id)}
                    className="p-0"
                  >
                    {selectedImages.includes(image.id) ? '선택 해제' : '선택'}
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">저장된 이미지가 없습니다.</p>
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}
