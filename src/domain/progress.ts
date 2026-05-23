import type { ProofEntry } from "./types";

export function getCompletedDays(proofs: ProofEntry[]): number {
  return new Set(proofs.map((proof) => proof.day)).size;
}

export function getRemainingDays(proofs: ProofEntry[]): number {
  return Math.max(90 - getCompletedDays(proofs), 0);
}

export function getCompletionPercent(proofs: ProofEntry[]): number {
  return Math.round((getCompletedDays(proofs) / 90) * 100);
}

export function getStreak(proofs: ProofEntry[], currentDay: number): number {
  const doneDays = new Set(proofs.map((proof) => proof.day));
  let streak = 0;

  for (let day = currentDay; day >= 1; day -= 1) {
    if (!doneDays.has(day)) break;
    streak += 1;
  }

  return streak;
}

export function getWeekForDay(day: number): number {
  return Math.ceil(day / 7);
}

export function getWeekDayRange(week: number): { start: number; end: number } {
  return { start: (week - 1) * 7 + 1, end: Math.min(week * 7, 90) };
}

export function getMotionDrillsThisWeek(proofs: ProofEntry[], week: number): number {
  const { start, end } = getWeekDayRange(week);
  return proofs.filter((proof) => proof.proofType === "motion-drill" && proof.day >= start && proof.day <= end).length;
}

export function shouldWarnMotionAvoidance(proofs: ProofEntry[], currentDay: number, targetPerWeek: number): boolean {
  const week = getWeekForDay(currentDay);
  const dayOfWeek = ((currentDay - 1) % 7) + 1;
  if (dayOfWeek < 4) return false;
  return getMotionDrillsThisWeek(proofs, week) < targetPerWeek;
}

export function getEmergencyCountThisWeek(proofs: ProofEntry[], week: number): number {
  const { start, end } = getWeekDayRange(week);
  return proofs.filter((proof) => proof.level === "emergency" && proof.day >= start && proof.day <= end).length;
}
