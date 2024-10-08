import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import WorkspaceNavigation from './WorkspaceNavigation';
import useAuthStore from '@/stores/useAuthStore';
import { Suspense } from 'react';
import AlarmPopover from './AlarmPopover';
import ProfilePopover from './ProfilePopover';

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const profile = useAuthStore((state) => state.profile);

  return (
    <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="flex items-center gap-4 md:gap-10">
        <Link
          to="/"
          className={cn('text-[20px] font-normal tracking-[-1.60px] text-black sm:text-[24px] md:text-[32px]')}
          style={{ fontFamily: "'Offside-Regular', Helvetica" }}
        >
          <img
            src="/worlabel.svg"
            alt="WorLabel"
          />
        </Link>

        {!isHomePage && profile && (
          <Suspense fallback={<div></div>}>
            <WorkspaceNavigation />
          </Suspense>
        )}
      </div>

      {!isHomePage && profile && (
        <div className="flex items-center gap-2">
          <AlarmPopover />
          <ProfilePopover />
        </div>
      )}
    </header>
  );
}
