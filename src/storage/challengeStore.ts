import type { ChallengeState } from "../domain/types";

const STORAGE_KEY = "challenge90.strictCoach.v1";

export function createDefaultState(): ChallengeState {
  return {
    startDate: new Date().toISOString().slice(0, 10),
    currentDay: 1,
    proofs: [],
    weeklyReviews: [],
    emergencyLimitPerWeek: 2,
    styleKit: {
      palette: ["#ffdd00", "#00c2ff", "#ff4fa3", "#111111", "#f7f7f2"],
      subtitleRule: "ซับไม่เกิน 2 บรรทัด ไฮไลต์เฉพาะคำสำคัญ",
      layoutRule: "หนึ่งจอมีหนึ่งข้อความหลัก ใช้สีสดเป็นจุดเน้น และจัดหน้าให้โล่ง",
    },
  };
}

export function loadChallengeState(): ChallengeState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultState();

  try {
    return { ...createDefaultState(), ...JSON.parse(raw) };
  } catch {
    return createDefaultState();
  }
}

export function saveChallengeState(state: ChallengeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetChallengeState(): ChallengeState {
  const state = createDefaultState();
  saveChallengeState(state);
  return state;
}
