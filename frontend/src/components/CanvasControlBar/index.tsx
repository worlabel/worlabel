import { Stage } from 'konva/lib/Stage';
import { useEffect } from 'react';

export default function CanvasControlBar({ stage }: { stage: Stage }) {
  useEffect(() => {
    console.log(stage);
  }, [stage]);

  return <div>CanvasControlBar</div>;
}
