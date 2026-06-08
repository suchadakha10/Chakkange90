import { describe, expect, it } from "vitest";
import { applyMissionOverrides, planWithMissionOverrides } from "../domain/missionOverrides";
import type { ChallengePlan, DailyMission, MissionOverride } from "../domain/types";

const mission = (day: number, title: string): DailyMission => ({
  day,
  week: 1,
  title,
  focus: `${title} focus`,
  format: "practice",
  requiresMotion: false,
  full: `${title} full`,
  minimum: `${title} minimum`,
  emergency: `${title} emergency`,
  proofPrompt: `${title} proof`,
});

describe("missionOverrides", () => {
  it("applies saved mission text without changing scheduling metadata", () => {
    const base = mission(3, "Seed task");
    const overrides: Record<string, MissionOverride> = {
      "3": {
        day: 3,
        title: "Custom task",
        focus: "Custom focus",
        full: "Custom full",
        minimum: "Custom minimum",
        emergency: "Custom emergency",
        proofPrompt: "Custom proof",
        updatedAt: "2026-06-08T00:00:00.000Z",
      },
    };

    expect(applyMissionOverrides(base, overrides)).toEqual({
      ...base,
      title: "Custom task",
      focus: "Custom focus",
      full: "Custom full",
      minimum: "Custom minimum",
      emergency: "Custom emergency",
      proofPrompt: "Custom proof",
    });
  });

  it("merges overrides into every plan view consumer", () => {
    const plan: ChallengePlan = {
      weeks: [
        {
          week: 1,
          theme: "Week",
          outcome: "Outcome",
          days: [mission(1, "Day 1"), mission(2, "Day 2")],
        },
      ],
    };

    const updatedPlan = planWithMissionOverrides(plan, {
      "2": {
        day: 2,
        title: "Edited Day 2",
        focus: "Edited focus",
        full: "Edited full",
        minimum: "Edited minimum",
        emergency: "Edited emergency",
        proofPrompt: "Edited proof",
        updatedAt: "2026-06-08T00:00:00.000Z",
      },
    });

    expect(updatedPlan.weeks[0].days[0].title).toBe("Day 1");
    expect(updatedPlan.weeks[0].days[1].title).toBe("Edited Day 2");
  });
});
