import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn('mt-[100px] border-t border-gray-200 bg-gray-100', className)}
      {...props}
    >
      <div className="container py-10">
        <div className="flex flex-col items-start gap-5">
          <div className="relative">
            <div className="font-heading text-lg text-gray-600 md:text-xl">WorLabel</div>
            <p className="font-body-small mt-2 text-gray-500">Copyright © 2024 WorLabel All rights reserved</p>
          </div>
          <div className="inline-flex items-center gap-4">
            <div className="font-body-small text-gray-500">서비스 이용약관</div>
            <div className="h-4 w-px bg-gray-400" />
            <div className="font-body-small text-gray-500">개인정보 처리방침</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
