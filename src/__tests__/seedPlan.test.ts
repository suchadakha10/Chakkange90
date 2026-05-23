import { describe, expect, it } from "vitest";
import { seedPlan } from "../domain/seedPlan";

describe("seedPlan", () => {
  it("contains 13 weeks and 90 days", () => {
    expect(seedPlan.weeks).toHaveLength(13);
    const days = seedPlan.weeks.flatMap((week) => week.days);
    expect(days).toHaveLength(90);
    expect(days[0].title).toContain("baseline");
  });

  it("makes Week 1 a CapCut Production Sprint with motion work", () => {
    expect(seedPlan.weeks[0].theme).toBe("CapCut Production Sprint");
    const weekOneMotionDays = seedPlan.weeks[0].days.filter((day) => day.requiresMotion);
    expect(weekOneMotionDays.length).toBeGreaterThanOrEqual(2);
  });
});
