import type { ChallengePlan, DailyMission, MissionOverride } from "./types";

export function applyMissionOverrides(mission: DailyMission, overrides: Record<string, MissionOverride>): DailyMission {
  const override = overrides[String(mission.day)];
  if (!override) return mission;

  return {
    ...mission,
    title: override.title,
    focus: override.focus,
    full: override.full,
    minimum: override.minimum,
    emergency: override.emergency,
    proofPrompt: override.proofPrompt,
  };
}

export function planWithMissionOverrides(plan: ChallengePlan, overrides: Record<string, MissionOverride>): ChallengePlan {
  return {
    ...plan,
    weeks: plan.weeks.map((week) => ({
      ...week,
      days: week.days.map((mission) => applyMissionOverrides(mission, overrides)),
    })),
  };
}
