import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultState, loadChallengeState, saveChallengeState } from "../storage/challengeStore";

describe("challengeStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates default state with style kit and day 1", () => {
    const state = createDefaultState();
    expect(state.currentDay).toBe(1);
    expect(state.styleKit.palette).toEqual(["#ffdd00", "#00c2ff", "#ff4fa3", "#111111", "#f7f7f2"]);
  });

  it("saves and loads state", () => {
    const state = createDefaultState();
    saveChallengeState({ ...state, currentDay: 5 });
    expect(loadChallengeState().currentDay).toBe(5);
  });
});
