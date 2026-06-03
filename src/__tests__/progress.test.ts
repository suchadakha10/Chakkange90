import { describe, expect, it } from "vitest";
import { getElapsedChallengeDay } from "../domain/challengeDates";
import {
  getCompletedDays,
  getCompletionPercent,
  getCurrentChallengeDay,
  getFirstIncompleteDay,
  getMotionDrillsThisWeek,
  getRemainingDays,
  getStreak,
  shouldWarnMotionAvoidance,
} from "../domain/progress";
import type { ProofEntry } from "../domain/types";

const proof = (day: number, proofType: ProofEntry["proofType"] = "post"): ProofEntry => ({
  id: `p-${day}-${proofType}`,
  day,
  level: "full",
  proofType,
  title: "Proof",
  notes: "Done",
  createdAt: "2026-05-23T00:00:00.000Z",
});

describe("progress rules", () => {
  it("treats June 3 as challenge day 12 when day 1 is May 23", () => {
    expect(getElapsedChallengeDay("2026-05-23", new Date("2026-06-03T12:00:00"))).toBe(12);
  });

  it("counts unique completed days", () => {
    expect(getCompletedDays([proof(1), proof(1, "hook"), proof(2)])).toBe(2);
  });

  it("calculates remaining days from unique proof days", () => {
    expect(getRemainingDays([proof(1), proof(1, "hook"), proof(90)])).toBe(88);
  });

  it("calculates completion percent from unique proof days", () => {
    expect(getCompletionPercent([proof(1), proof(2), proof(3), proof(4), proof(5)])).toBe(6);
  });

  it("finds the first day that still has no proof", () => {
    expect(getFirstIncompleteDay([])).toBe(1);
    expect(getFirstIncompleteDay([proof(1), proof(3)])).toBe(2);
    expect(getFirstIncompleteDay(Array.from({ length: 90 }, (_, index) => proof(index + 1)))).toBe(90);
  });

  it("does not unlock a future day just because today's proof is done", () => {
    expect(getCurrentChallengeDay([proof(1)], "2026-05-23", new Date("2026-05-23T12:00:00"))).toBe(1);
    expect(getCurrentChallengeDay([proof(1)], "2026-05-23", new Date("2026-05-24T12:00:00"))).toBe(2);
    expect(getCurrentChallengeDay([], "2026-05-23", new Date("2026-05-24T12:00:00"))).toBe(1);
  });

  it("calculates streak ending at the current day", () => {
    expect(getStreak([proof(1), proof(2), proof(4)], 4)).toBe(1);
    expect(getStreak([proof(1), proof(2), proof(3)], 3)).toBe(3);
  });

  it("counts motion drills inside a week", () => {
    expect(getMotionDrillsThisWeek([proof(1, "motion-drill"), proof(8, "motion-drill")], 1)).toBe(1);
  });

  it("warns when motion drills are below target after midweek", () => {
    expect(shouldWarnMotionAvoidance([], 4, 2)).toBe(true);
    expect(shouldWarnMotionAvoidance([proof(1, "motion-drill"), proof(3, "motion-drill")], 4, 2)).toBe(false);
  });
});
