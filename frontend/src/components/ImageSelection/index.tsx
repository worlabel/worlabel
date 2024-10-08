import { useState, useCallback, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import useRecursiveSavedImages from '@/hooks/useRecursiveSavedImages';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import ImageWithLabels from './ImageSelectionWithLabels';
import { FixedSizeList } from 'react-window';
import React from 'react';

interface ImageSelectionProps {
  projectId: string;
  selectedImages: number[];
  setSelectedImages: (images: number[]) => void;
}

export default function ImageSelection({ projectId, selectedImages, setSelectedImages }: ImageSelectionProps) {
  const { allSavedImages } = useRecursiveSavedImages(projectId, 0);
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null);
  const [selectedLabelData, setSelectedLabelData] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageSelect = useCallback(
    (imageId: number) => {
      if (selectedImages.includes(imageId)) {
        setSelectedImages(selectedImages.filter((id) => id !== imageId));
      } else {
        setSelectedImages([...selectedImages, imageId]);
      }
    },
    [selectedImages, setSelectedImages]
  );

  const handleSelectAll = useCallback(() => {
    if (allSavedImages) {
      if (selectedImages.length === allSavedImages.length) {
        setSelectedImages([]);
      } else {
        setSelectedImages(allSavedImages.map((image) => image.id));
      }
    }
  }, [allSavedImages, selectedImages, setSelectedImages]);

  const handleOpenDialog = (imagePath: string, labelData: string) => {
    setSelectedImagePath(imagePath);
    setSelectedLabelData(labelData);
    setIsDialogOpen(true);
  };

  const Row = useMemo(() => {
    return React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
      const image = allSavedImages[index];

      return (
        <div
          key={image.id}
          style={style}
          className={`relative flex items-center justify-between border p-2 ${
            selectedImages.includes(image.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => setIsDialogOpen(open)}
          >
            <DialogTrigger asChild>
              <span
                className="cursor-pointer truncate"
                onClick={() => handleOpenDialog(image.imagePath, image.dataPath)}
              >
                {image.imageTitle}
              </span>
            </DialogTrigger>
            {isDialogOpen && selectedImagePath && selectedLabelData && (
              <DialogContent className="h-[600px] w-[1000px]">
                <DialogHeader title={image.imageTitle} />
                <ImageWithLabels
                  imagePath={selectedImagePath}
                  labelData={selectedLabelData}
                  width={400}
                  height={400}
                />
              </DialogContent>
            )}
          </Dialog>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedImages.includes(image.id) ? 'blue' : 'black'}
              size="sm"
              onClick={() => handleImageSelect(image.id)}
              className="px-3 py-1"
              type="button"
            >
              {selectedImages.includes(image.id) ? '해제' : '선택'}
            </Button>
          </div>
        </div>
      );
    });
  }, [allSavedImages, selectedImages, selectedImagePath, selectedLabelData, handleImageSelect, isDialogOpen]);

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <Label>이미지 선택 (파일 목록)</Label>
        <Button
          variant={allSavedImages && selectedImages.length === allSavedImages.length ? 'blue' : 'black'}
          size="sm"
          onClick={handleSelectAll}
          type="button"
          className="px-4 py-2"
        >
          {allSavedImages && selectedImages.length === allSavedImages.length ? '전체 선택 해제' : '전체 선택'}
        </Button>
      </div>
      {allSavedImages && allSavedImages.length > 0 ? (
        <FixedSizeList
          height={260}
          itemCount={allSavedImages.length}
          itemSize={80}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      ) : (
        <p className="text-gray-500">저장된 이미지가 없습니다.</p>
      )}
    </div>
  );
}
