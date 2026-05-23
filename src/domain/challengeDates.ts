export function getChallengeDate(startDate: string, day: number): Date {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + day - 1);
  return date;
}

export function formatChallengeDate(startDate: string, day: number): string {
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(getChallengeDate(startDate, day));
}
