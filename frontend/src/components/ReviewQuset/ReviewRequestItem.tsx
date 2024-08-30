import { Briefcase, MessageCircle, RefreshCw, Tag, Box, Layers, Pen } from 'lucide-react';

interface ReviewRequestItemProps {
  title: string;
  createdTime: string;
  creatorName: string;
  project: string;
  status: string;
  commentsCount: number;
  updatesCount: number;
  lastUpdated: string;
  type: { text: 'Classification' | 'Detection' | 'Polygon' | 'Polyline'; color: string };
}

const typeIcons: Record<'Classification' | 'Detection' | 'Polygon' | 'Polyline', JSX.Element> = {
  Classification: <Tag className="h-4 w-4 text-white" />,
  Detection: <Box className="h-4 w-4 text-white" />,
  Polygon: <Layers className="h-4 w-4 text-white" />,
  Polyline: <Pen className="h-4 w-4 text-white" />,
};

const typeStyles: Record<'Classification' | 'Detection' | 'Polygon' | 'Polyline', string> = {
  Classification: '#a2eeef',
  Detection: '#d4c5f9',
  Polygon: '#f9c5d4',
  Polyline: '#c5f9d4',
};

export default function ReviewRequestItem({
  title,
  createdTime,
  creatorName,
  project,
  status,
  commentsCount,
  updatesCount,
  lastUpdated,
  type,
}: ReviewRequestItemProps) {
  const icon = typeIcons[type.text];
  const bgColor = typeStyles[type.text];

  return (
    <div className="flex h-[100px] w-full items-center justify-between border-b-[0.67px] border-[#ececef] bg-[#fbfafd] p-4">
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-[#333238]">{title}</p>
        <p className="mt-1 text-xs text-[#737278]">
          {createdTime} by {creatorName}
        </p>
        <div className="mt-1 flex items-center">
          <Briefcase className="h-3 w-3 text-[#737278]" />
          <p className="ml-1 text-xs text-[#737278]">{project}</p>
        </div>
        {type && (
          <div
            className="mt-1 inline-flex max-w-fit items-center gap-1 rounded-full px-3 py-1 text-xs text-white"
            style={{ backgroundColor: bgColor, padding: '1px 5px' }}
          >
            {icon}
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{type.text}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[#cbe2f9] px-3 py-0.5 text-center text-xs text-[#0b5cad]">{status}</div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-[#737278]" />
            <span className="text-sm">{commentsCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4 text-[#737278]" />
            <span className="text-sm">{updatesCount}</span>
          </div>
        </div>
        <p className="text-xs text-[#737278]">{lastUpdated}</p>
      </div>
    </div>
  );
}
