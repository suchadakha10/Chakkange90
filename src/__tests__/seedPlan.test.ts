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

  it("makes Week 2 a detailed CapCut shop content system", () => {
    expect(seedPlan.weeks[1].theme).toBe("CapCut Shop Content System");
    expect(seedPlan.weeks[1].days[0].title).toBe("ตั้งระบบโปรเจกต์ CapCut ประจำช่อง");
    expect(seedPlan.weeks[1].days[3].full).toContain("CapCut สำหรับร้านเล็ก");

    const weekTwoMotionDays = seedPlan.weeks[1].days.filter((day) => day.requiresMotion);
    expect(weekTwoMotionDays.length).toBeGreaterThanOrEqual(2);
  });
});
