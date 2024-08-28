import * as React from 'react';
import { cn } from '@/lib/utils';
import bellIcon from '@/assets/icons/bell.svg';
import userIcon from '@/assets/icons/user.svg';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 w-full items-center justify-between border-b px-4 sm:px-6 md:px-8 lg:px-10',
        'bg-color-background-default-default border-color-border-default-default',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4 md:gap-10">
        <div
          className={cn('text-[20px] font-normal tracking-[-1.60px] text-black sm:text-[24px] md:text-[32px]')}
          style={{ fontFamily: "'Offside-Regular', Helvetica" }}
        >
          WorLabel
        </div>
        <nav className="hidden items-center gap-5 md:flex">
          <div className={cn('text-color-text-default-default', 'font-body-strong', 'text-sm sm:text-base md:text-lg')}>
            workspace
          </div>
          <div className={cn('text-color-text-default-default', 'font-body', 'text-sm sm:text-base md:text-lg')}>
            labeling
          </div>
        </nav>
      </div>
      <div className="flex items-center gap-4 md:gap-5">
        <img
          className="h-4 w-4 sm:h-5 sm:w-5"
          src={bellIcon}
          alt="Bell Icon"
        />
        <img
          className="h-4 w-4 sm:h-5 sm:w-5"
          src={userIcon}
          alt="User Icon"
        />
      </div>
    </header>
  );
}
