export default function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds === 1) return `${Math.max(diffInSeconds, 0)} second ago`;
  if (diffInSeconds < 60) return `${Math.max(diffInSeconds, 0)} seconds ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) return `${diffInMinutes} minute ago`;
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return `${diffInHours} hour ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return `${diffInDays} day ago`;
  return `${diffInDays} days ago`;
}
