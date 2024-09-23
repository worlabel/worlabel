import { Label } from '@/components/ui/label';
import useFolderQuery from '@/queries/folders/useFolderQuery';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageSelectionProps {
  projectId: string;
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function ImageSelection({ projectId, selectedImages, setSelectedImages }: ImageSelectionProps) {
  const { data: folderData } = useFolderQuery(projectId, 0);
  const savedImages = folderData?.images.filter((image) => image.status === 'SAVE') || [];

  const handleImageSelect = (imageId: number) => {
    setSelectedImages((prev: number[]) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    );
  };

  return (
    <div className="mb-4">
      <Label>이미지 선택 (파일 목록)</Label>
      <ScrollArea className="max-h-64 overflow-auto border p-2">
        <ul className="space-y-2">
          {savedImages.length > 0 ? (
            savedImages.map((image) => (
              <li
                key={image.id}
                className={`relative flex items-center justify-between border p-2 ${
                  selectedImages.includes(image.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <span className="truncate">{image.imageTitle}</span>
                <div className="flex items-center space-x-2">
                  {selectedImages.includes(image.id) && (
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => handleImageSelect(image.id)}
                      className="p-0"
                    >
                      X
                    </Button>
                  )}
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
