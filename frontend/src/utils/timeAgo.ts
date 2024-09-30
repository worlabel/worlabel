export default function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${Math.max(diffInSeconds, 0)}초 전`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
}
