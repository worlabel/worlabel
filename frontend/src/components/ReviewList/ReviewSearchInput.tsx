import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import SearchInput from '@/components/ui/search-input';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'latest', label: '최신 순' },
  { value: 'oldest', label: '오래된 순' },
  { value: 'comments', label: '댓글 많은 순' },
  { value: 'updates', label: '업데이트 많은 순' },
];

interface ReviewSearchInputProps {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  sortValue: string;
}

export default function ReviewSearchInput({ onSearchChange, onSortChange, sortValue }: ReviewSearchInputProps) {
  return (
    <div className={cn('flex w-full items-center justify-between border-b-[0.67px] border-[#ececef] bg-[#fbfafd] p-4')}>
      <div className="flex flex-1 items-center gap-4">
        <SearchInput
          className="flex-1"
          placeholder="검색 또는 필터..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select
          value={sortValue}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="w-[180px] rounded-md border border-gray-200">
            <SelectValue placeholder="정렬 기준 선택" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
