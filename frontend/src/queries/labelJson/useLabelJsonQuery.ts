import { getLabelJson } from '@/api/labelJsonApi';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useLabelJsonQuery(jsonPath: string) {
  return useSuspenseQuery({
    queryKey: ['labelJson', jsonPath],
    queryFn: () => getLabelJson(jsonPath),
  });
}
