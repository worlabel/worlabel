import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(({ className, ...props }, ref) => (
  <div className={cn('relative flex items-center', className)}>
    <input
      ref={ref}
      type="text"
      className={cn(
        'h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-gray-300',
        className
      )}
      placeholder="Search..."
      {...props}
    />
    <Search className="pointer-events-none absolute right-3 h-4 w-4 text-gray-500" />
  </div>
));

SearchInput.displayName = 'SearchInput';

export default SearchInput;
