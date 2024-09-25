import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialogCustom';
import { User } from 'lucide-react';
import UserProfileForm from './UserProfileForm';

export default function UserProfileModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center p-2"
          onClick={handleOpen}
        >
          <User className="h-4 w-4 text-black sm:h-5 sm:w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader title="프로필" />
        <UserProfileForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
