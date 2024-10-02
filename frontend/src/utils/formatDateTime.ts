export default function formatDateTime(dateTimeString: string): string {
  const [date, time] = dateTimeString.split('T');
  const [hours, minutes] = time.split(':');

  return `${date} ${hours}:${minutes}`;
}
