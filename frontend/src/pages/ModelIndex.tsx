import { Smile } from 'lucide-react';

export default function ModelIndex() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Smile
        size={48}
        className="mb-2 text-gray-300"
      />
      <div className="body-strong text-gray-400">작업할 프로젝트를 선택하세요.</div>
    </div>
  );
}
