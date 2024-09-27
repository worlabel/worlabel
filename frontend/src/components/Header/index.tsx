import * as React from 'react';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import UserProfileModal from './UserProfileModal';
import WorkspaceNavigation from './WorkspaceNavigation';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Header({ className, ...props }: HeaderProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header
      className={cn(
        'flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 md:px-8 lg:px-10',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4 md:gap-10">
        <Link
          to="/"
          className={cn('text-[20px] font-normal tracking-[-1.60px] text-black sm:text-[24px] md:text-[32px]')}
          style={{ fontFamily: "'Offside-Regular', Helvetica" }}
        >
          WorLabel
        </Link>

        {!isHomePage && <WorkspaceNavigation />}
      </div>

      {!isHomePage && (
        <div className="flex items-center gap-4 md:gap-5">
          <Bell className="h-4 w-4 text-black sm:h-5 sm:w-5" />
          <UserProfileModal />
        </div>
      )}
    </header>
  );
}
