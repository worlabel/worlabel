import { searchMembersByEmail } from '@/api/memberApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useSearchMembersByEmailQuery(keyword: string) {
  return useSuspenseQuery({
    queryKey: ['members', keyword],
    queryFn: () => searchMembersByEmail(keyword),
  });
}
