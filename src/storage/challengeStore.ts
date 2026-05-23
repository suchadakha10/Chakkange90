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
      subtitleRule: "No more than 2 lines. Highlight only the key word.",
      layoutRule: "One main message per screen. Bright accents, clean layout.",
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
