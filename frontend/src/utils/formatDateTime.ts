export default function formatDateTime(dateTimeString: string): string {
  const [date, time] = dateTimeString.split('T');
  const [year, month, day] = date.split('-');
  const [hours, minutes, seconds] = time.split(':');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
