import { Label } from '@/components/ui/label';
import useRecursiveSavedImages from '@/hooks/useRecursiveSavedImages';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageSelectionProps {
  projectId: string;
  selectedImages: number[];
  setSelectedImages: (images: number[]) => void;
}

export default function ImageSelection({ projectId, selectedImages, setSelectedImages }: ImageSelectionProps) {
  const { allSavedImages } = useRecursiveSavedImages(projectId, 0);

  const handleImageSelect = (imageId: number) => {
    const updatedImages = selectedImages.includes(imageId)
      ? selectedImages.filter((id) => id !== imageId)
      : [...selectedImages, imageId];

    setSelectedImages(updatedImages);
  };

  const handleSelectAll = () => {
    if (allSavedImages) {
      if (selectedImages.length === allSavedImages.length) {
        setSelectedImages([]);
      } else {
        setSelectedImages(allSavedImages.map((image) => image.id));
      }
    }
  };

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <Label>이미지 선택 (파일 목록)</Label>
        <Button
          variant="blue"
          size="sm"
          onClick={handleSelectAll}
          type="button"
          className="px-4 py-2"
        >
          {allSavedImages && selectedImages.length === allSavedImages.length ? '전체 선택 해제' : '전체 선택'}
        </Button>
      </div>
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
                    variant={selectedImages.includes(image.id) ? 'red' : 'blue'}
                    size="sm"
                    onClick={() => handleImageSelect(image.id)}
                    className="px-3 py-1"
                    type="button"
                  >
                    {selectedImages.includes(image.id) ? '해제' : '선택'}
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
