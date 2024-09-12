import * as React from 'react';
import ProjectCreateForm, { ProjectCreateFormValues } from './ProjectCreateForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProjectCreateModalProps {
  onSubmit: (data: { title: string; labelType: 'classification' | 'detection' | 'segmentation' }) => void;
}

export default function ProjectCreateModal({ onSubmit }: ProjectCreateModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const formatLabelType = (
    labelType: 'Classification' | 'Detection' | 'Segmentation'
  ): 'classification' | 'detection' | 'segmentation' => {
    switch (labelType) {
      case 'Classification':
        return 'classification';
      case 'Detection':
        return 'detection';
      case 'Segmentation':
        return 'segmentation';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outlinePrimary"
          className="mt-4 flex items-center gap-2"
          onClick={handleOpen}
        >
          <Plus size={16} />
          <span>프로젝트 추가</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="새 프로젝트" />
        <ProjectCreateForm
          onSubmit={(data: ProjectCreateFormValues) => {
            const formattedData = {
              title: data.projectName,
              labelType: formatLabelType(data.labelType),
            };
            onSubmit(formattedData);
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
