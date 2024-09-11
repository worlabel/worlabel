import * as React from 'react';
import ProjectCreateForm, { ProjectCreateFormValues } from './ProjectCreateForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProjectCreateModal({
  onSubmit,
}: {
  onSubmit: (data: { title: string; labelType: 'Classification' | 'Detection' | 'Segmentation' }) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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
              labelType: data.labelType,
            };
            onSubmit(formattedData);
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
