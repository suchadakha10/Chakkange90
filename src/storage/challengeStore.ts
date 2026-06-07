import type { ChallengeState } from "../domain/types";
import { getCurrentChallengeDay } from "../domain/progress";

const STORAGE_KEY = "challenge90.strictCoach.v1";
const DEFAULT_START_DATE = "2026-05-23";

function getStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function createDefaultState(): ChallengeState {
  return {
    startDate: DEFAULT_START_DATE,
    currentDay: 1,
    proofs: [],
    weeklyReviews: [],
    emergencyLimitPerWeek: 2,
    proofSync: {
      scriptUrl: "",
      secret: "",
    },
    styleKit: {
      palette: ["#ffdd00", "#00c2ff", "#ff4fa3", "#111111", "#f7f7f2"],
      subtitleRule: "ซับไม่เกิน 2 บรรทัด ไฮไลต์เฉพาะคำสำคัญ",
      layoutRule: "หนึ่งจอมีหนึ่งข้อความหลัก ใช้สีสดเป็นจุดเน้น และจัดหน้าให้โล่ง",
    },
  };
}

export function getTodayDateInputValue(today: Date = new Date()): string {
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
}

export function loadChallengeState(): ChallengeState {
  const defaults = createDefaultState();
  const storage = getStorage();
  const raw = storage?.getItem(STORAGE_KEY);
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as Partial<ChallengeState>;
    const state = {
      ...defaults,
      ...parsed,
      startDate: parsed.startDate === "2026-05-26" || parsed.startDate === "2026-05-27" ? DEFAULT_START_DATE : parsed.startDate ?? defaults.startDate,
      proofSync: { ...defaults.proofSync, ...parsed.proofSync },
      styleKit: { ...defaults.styleKit, ...parsed.styleKit },
    };
    return { ...state, currentDay: getCurrentChallengeDay(state.proofs, state.startDate) };
  } catch {
    return defaults;
  }
}

export function saveChallengeState(state: ChallengeState): void {
  getStorage()?.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetChallengeState(): ChallengeState {
  const state = createDefaultState();
  saveChallengeState(state);
  return state;
}

export function restartChallengeStateFromToday(state: ChallengeState, today: Date = new Date()): ChallengeState {
  const nextState = {
    ...state,
    startDate: getTodayDateInputValue(today),
    currentDay: 1,
    proofs: [],
    weeklyReviews: [],
  };
  saveChallengeState(nextState);
  return nextState;
}
