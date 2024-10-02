import timeAgo from './timeAgo';

describe('timeAgo', () => {
  it('should return "1 second ago" for a date 1 second ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 1000);
    expect(timeAgo(past)).toBe('1 second ago');
  });

  it('should return "x seconds ago" for a date less than a minute ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 45000); // 45 seconds ago
    expect(timeAgo(past)).toBe('45 seconds ago');
  });

  it('should return "1 minute ago" for a date 1 minute ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 60000); // 1 minute ago
    expect(timeAgo(past)).toBe('1 minute ago');
  });

  it('should return "x minutes ago" for a date less than an hour ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 1800000); // 30 minutes ago
    expect(timeAgo(past)).toBe('30 minutes ago');
  });

  it('should return "1 hour ago" for a date 1 hour ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 3600000); // 1 hour ago
    expect(timeAgo(past)).toBe('1 hour ago');
  });

  it('should return "x hours ago" for a date less than a day ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 7200000); // 2 hours ago
    expect(timeAgo(past)).toBe('2 hours ago');
  });

  it('should return "1 day ago" for a date 1 day ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 86400000); // 1 day ago
    expect(timeAgo(past)).toBe('1 day ago');
  });

  it('should return "x days ago" for a date more than a day ago', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 172800000); // 2 days ago
    expect(timeAgo(past)).toBe('2 days ago');
  });
});
