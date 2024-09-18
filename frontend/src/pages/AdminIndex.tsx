import { Smile } from 'lucide-react';

export default function AdminIndex() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <Smile
          size={48}
          className="mb-2 text-gray-300"
        />
        <div className="body text-gray-400">프로젝트를 선택하거나 생성하세요.</div>
      </div>
    </div>
  );
}
