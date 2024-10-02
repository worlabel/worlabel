import { Briefcase, Tag, Box, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProjectQuery from '@/queries/projects/useProjectQuery';
import useAuthStore from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import formatDateTime from '@/utils/formatDateTime';
import { ReviewStatus } from '@/types';

interface ReviewItemProps {
  title: string;
  createdTime: string;
  creatorName: string;
  projectId: number;
  status: ReviewStatus;
  type?: { text: 'classification' | 'detection' | 'segmentation'; color: string };
  workspaceId: number;
  reviewId: number;
}

const typeIcons: Record<'classification' | 'detection' | 'segmentation', JSX.Element> = {
  classification: <Tag className="h-4 w-4 text-white" />,
  detection: <Box className="h-4 w-4 text-white" />,
  segmentation: <Layers className="h-4 w-4 text-white" />,
};

export default function ReviewItem({
  title,
  createdTime,
  creatorName,
  projectId,
  status,
  type,
  workspaceId,
  reviewId,
}: ReviewItemProps) {
  const profile = useAuthStore((state) => state.profile);
  const memberId = profile?.id || 0;
  const icon = type ? typeIcons[type.text] : null;
  const { data: projectData } = useProjectQuery(projectId, memberId);

  return (
    <Link
      to={`/admin/${workspaceId}/reviews/${projectId}/${reviewId}`}
      className="block hover:bg-gray-100"
    >
      <div className="flex h-[100px] w-full items-center justify-between border-b-[0.67px] border-[#ececef] bg-[#fbfafd] p-4">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-black">{title}</p>
          <p className="mt-1 text-xs text-gray-500">by {creatorName}</p>
          <div className="mt-1 flex items-center">
            <Briefcase className="h-3 w-3 text-gray-500" />
            <p className="ml-1 text-xs text-gray-500">{projectData?.title}</p>
          </div>
          {type && (
            <div
              className="mt-1 inline-flex max-w-fit items-center gap-1 rounded-full px-3 py-1 text-xs text-white"
              style={{ backgroundColor: type.color, padding: '1px 5px' }}
            >
              {icon}
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{type.text}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className={cn(
              'rounded-full px-3 py-0.5 text-center text-xs',
              status === 'APPROVED'
                ? 'bg-green-100 text-green-600'
                : status === 'REJECTED'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600'
            )}
          >
            {status}
          </div>
          <p className="text-xs text-gray-500">Created at {formatDateTime(createdTime)}</p>
        </div>
      </div>
    </Link>
  );
}
