import api from '@/api/axiosConfig';
import { AlarmResponse } from '@/types';

export async function getAlarmList() {
  return api.get<AlarmResponse[]>('/alarm').then(({ data }) => data);
}

export async function createTestAlarm() {
  return api.post('/alarm/test').then(({ data }) => data);
}

export async function readAlarm(alarmId: number) {
  return api.put(`/alarm/${alarmId}`).then(({ data }) => data);
}

export async function deleteAlarm(alarmId: number) {
  return api.delete(`/alarm/${alarmId}`).then(({ data }) => data);
}

export async function deleteAllAlarm() {
  return api.delete('/alarm').then(({ data }) => data);
}
