import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogClose } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  content: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ title, content, open, onClose }: ModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogOverlay className="fixed inset-0 bg-black/50" />
      <DialogContent className="fixed left-1/2 top-1/2 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogClose asChild>
            <button className="text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </DialogClose>
        </div>
        <div className="mt-4">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
