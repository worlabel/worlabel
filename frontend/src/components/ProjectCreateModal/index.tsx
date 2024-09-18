import * as React from 'react';
import ProjectCreateForm, { ProjectCreateFormValues } from './ProjectCreateForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectRequest } from '@/types';

interface ProjectCreateModalProps {
  onSubmit: (data: ProjectRequest) => void;
  buttonClass?: string;
}

export default function ProjectCreateModal({ onSubmit, buttonClass = '' }: ProjectCreateModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const formatLabelType = (
    labelType: 'Classification' | 'Detection' | 'Segmentation'
  ): ProjectRequest['projectType'] => {
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
          className={`${buttonClass}`}
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
            const formattedData: ProjectRequest = {
              title: data.projectName,
              projectType: formatLabelType(data.labelType),
            };
            onSubmit(formattedData);
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
