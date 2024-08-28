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
            <div className="text-lg text-gray-600 font-heading md:text-xl">WorLabel</div>
            <p className="mt-2 text-gray-500 font-body-small">Copyright © 2024 WorLabel All rights reserved</p>
          </div>
          <div className="inline-flex items-center gap-4">
            <div className="text-gray-500 font-body-small">서비스 이용약관</div>
            <div className="w-px h-4 bg-gray-400" />
            <div className="text-gray-500 font-body-small">개인정보 처리방침</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
