import { useState } from 'react';
import { User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import useAuthStore from '@/stores/useAuthStore';
import useLogoutQuery from '@/queries/auth/useLogoutQuery';
import { Button } from '../ui/button';

export default function ProfilePopover() {
  const profile = useAuthStore((state) => state.profile);
  const { nickname, profileImage } = profile || { nickname: '', profileImage: '' };

  const logoutMutation = useLogoutQuery();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logoutMutation.mutate(undefined, {
      // onSuccess: () => {
      //   onClose();
      // },
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-center p-2">
          <User className="h-4 w-4 cursor-pointer text-black sm:h-5 sm:w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 overflow-hidden rounded-lg p-0"
        align="end"
        sideOffset={14}
        alignOffset={0}
      >
        <div className="m-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {profileImage ? (
              <img
                src={profileImage}
                alt={`${nickname}'s profile`}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300"></div>
            )}
            <div className="subheading">{nickname || 'Guest'}</div>
          </div>
          <div className="w-full">
            <Button
              variant="blue"
              className="w-full"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
