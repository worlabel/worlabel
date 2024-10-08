import { useState } from 'react';
import { Button } from '../ui/button';
import useAuthStore from '@/stores/useAuthStore';
import useLogoutQuery from '@/queries/auth/useLogoutQuery';
export default function UserProfileForm({ onClose }: { onClose: () => void }) {
  const profile = useAuthStore((state) => state.profile);
  const { nickname, profileImage } = profile || { nickname: '', profileImage: '' };

  const logoutMutation = useLogoutQuery();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        {profileImage ? (
          <img
            src={profileImage}
            alt={`${nickname}'s profile`}
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-300"></div>
        )}

        <div className="text-lg font-bold">{nickname || 'Guest'}</div>
      </div>

      <Button
        onClick={handleLogout}
        variant="blue"
        className="mt-4"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
      </Button>
    </div>
  );
}
