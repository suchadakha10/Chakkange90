import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultState, loadChallengeState, saveChallengeState } from "../storage/challengeStore";
import type { ProofEntry } from "../domain/types";

const proof = (day: number): ProofEntry => ({
  id: `p-${day}`,
  day,
  level: "full",
  proofType: "post",
  title: "Proof",
  notes: "Done",
  createdAt: "2026-05-23T00:00:00.000Z",
});

describe("challengeStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates default state with style kit and day 1", () => {
    const state = createDefaultState();
    expect(state.currentDay).toBe(1);
    expect(state.proofSync).toEqual({ scriptUrl: "", secret: "" });
    expect(state.styleKit.palette).toEqual(["#ffdd00", "#00c2ff", "#ff4fa3", "#111111", "#f7f7f2"]);
  });

  it("saves and loads state", () => {
    const state = createDefaultState();
    saveChallengeState({ ...state, startDate: "2026-05-19", currentDay: 5, proofs: [proof(1), proof(2), proof(3), proof(4)] });
    expect(loadChallengeState().currentDay).toBe(5);
  });

  it("resets a stale current day to day 1 when day 1 has no proof", () => {
    const state = createDefaultState();
    saveChallengeState({ ...state, currentDay: 2, proofs: [] });
    expect(loadChallengeState().currentDay).toBe(1);
  });
});
