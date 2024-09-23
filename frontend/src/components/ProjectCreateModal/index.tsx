import * as React from 'react';
import ProjectCreateForm, { ProjectCreateFormValues } from './ProjectCreateForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { Button } from '@/components/ui/button';
import { ProjectRequest } from '@/types';

interface ProjectCreateModalProps {
  onSubmit: (data: ProjectRequest) => void;
  buttonClass?: string;
}

export default function ProjectCreateModal({ onSubmit, buttonClass = '' }: ProjectCreateModalProps) {
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
          className={`${buttonClass}`}
          size={'xs'}
          onClick={handleOpen}
        >
          <span>새 프로젝트</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="새 프로젝트" />
        <ProjectCreateForm
          onSubmit={(data: ProjectCreateFormValues) => {
            const formattedData: ProjectRequest = {
              title: data.projectName,
              projectType: data.labelType.toLowerCase() as ProjectRequest['projectType'],
            };
            onSubmit(formattedData);
            handleClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
