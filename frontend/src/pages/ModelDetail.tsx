import { Suspense } from 'react';
import ModelManage from '@/components/ModelManage';

export default function ModelDetail() {
  return (
    <Suspense fallback={<div></div>}>
      <div className="flex h-full w-full justify-center">
        <ModelManage />
      </div>
    </Suspense>
  );
}
