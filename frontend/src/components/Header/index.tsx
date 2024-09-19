import * as React from 'react';
import { cn } from '@/lib/utils';
import { Bell, User } from 'lucide-react';
import { useLocation, Link, useParams } from 'react-router-dom';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Header({ className, ...props }: HeaderProps) {
  const location = useLocation();
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId?: string }>();
  const isWorkspaceIdNaN = isNaN(Number(workspaceId));

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

        {!isHomePage && (
          <nav className="hidden items-center gap-5 md:flex">
            <Link
              to={isWorkspaceIdNaN ? '/browse' : `/browse/${workspaceId}`}
              className={cn('text-color-text-default-default', 'font-body-strong', 'text-sm sm:text-base md:text-lg')}
            >
              workspace
            </Link>
            {!isWorkspaceIdNaN && (
              <>
                <Link
                  to={`/workspace/${workspaceId}`}
                  className={cn('text-color-text-default-default', 'font-body', 'text-sm sm:text-base md:text-lg')}
                >
                  labeling
                </Link>
                <Link
                  to={`/admin/${workspaceId}/project/${projectId ?? ''}`}
                  className={cn('text-color-text-default-default', 'font-body', 'text-sm sm:text-base md:text-lg')}
                >
                  admin
                </Link>
              </>
            )}
          </nav>
        )}
      </div>

      {!isHomePage && (
        <div className="flex items-center gap-4 md:gap-5">
          <Bell className="h-4 w-4 text-black sm:h-5 sm:w-5" />
          <User className="h-4 w-4 text-black sm:h-5 sm:w-5" />
        </div>
      )}
    </header>
  );
}
