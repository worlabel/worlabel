// 임시 가짜 훅
import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import useTrainStore from '@/stores/useTrainStore';

export default function useTrainPolling(start: boolean, projectId?: string | null) {
  const { addTrainingData, resetTrainingData } = useTrainStore((state) => ({
    addTrainingData: state.addTrainingData,
    resetTrainingData: state.resetTrainingData,
  }));

  const intervalIdRef = useRef<number | null>(null);
  // 함수 api 후 교체 예정
  const fetchTrainingData = useCallback(async () => {
    if (projectId) {
      try {
        const response = await axios.get(`/api/바보=${projectId}`);
        const data = response.data;

        addTrainingData(projectId, {
          epoch: data.epoch,
          total_epochs: data.total_epochs,
          box_loss: data.box_loss,
          cls_loss: data.cls_loss,
          dfl_loss: data.dfl_loss,
          fitness: data.fitness,
          epoch_time: data.epoch_time,
          left_second: data.left_second,
        });
      } catch (error) {
        console.error('Fetching error:', error);
      }
    }
  }, [projectId, addTrainingData]);

  useEffect(() => {
    if (start && projectId) {
      resetTrainingData(projectId);
      intervalIdRef.current = window.setInterval(fetchTrainingData, 5000);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [start, projectId, fetchTrainingData, resetTrainingData]);
}
