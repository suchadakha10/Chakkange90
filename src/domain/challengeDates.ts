export function getChallengeDate(startDate: string, day: number): Date {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + day - 1);
  return date;
}

export function getElapsedChallengeDay(startDate: string, today: Date = new Date()): number {
  const start = new Date(`${startDate}T00:00:00`);
  const current = new Date(today);
  current.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const elapsed = Math.floor((current.getTime() - start.getTime()) / millisecondsPerDay) + 1;
  return Math.min(Math.max(elapsed, 1), 90);
}

export function formatChallengeDate(startDate: string, day: number): string {
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(getChallengeDate(startDate, day));
}
