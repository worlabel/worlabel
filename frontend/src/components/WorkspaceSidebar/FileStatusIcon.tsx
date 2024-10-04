import { ImageStatus } from '@/types';
import { Minus, Loader, ArrowDownToLine, Send, CircleSlash, Check } from 'lucide-react';
import React from 'react';

function FileStatusIcon({ imageStatus }: { imageStatus: ImageStatus }) {
  return imageStatus === 'PENDING' ? (
    <Minus
      size={12}
      className="shrink-0 stroke-gray-400"
    />
  ) : imageStatus === 'IN_PROGRESS' ? (
    <Loader
      size={12}
      className="shrink-0 stroke-yellow-400"
    />
  ) : imageStatus === 'SAVE' ? (
    <ArrowDownToLine
      size={12}
      className="shrink-0 stroke-gray-400"
    />
  ) : imageStatus === 'REVIEW_REQUEST' ? (
    <Send
      size={12}
      className="shrink-0 stroke-blue-400"
    />
  ) : imageStatus === 'REVIEW_REJECT' ? (
    <CircleSlash
      size={12}
      className="shrink-0 stroke-red-400"
    />
  ) : (
    <Check
      size={12}
      className="shrink-0 stroke-green-400"
    />
  );
}

const MemoFileStatusIcon = React.memo(FileStatusIcon);

export default MemoFileStatusIcon;
