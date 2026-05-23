import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodayCommandCenter } from "../components/TodayCommandCenter";
import type { ChallengeState, DailyMission } from "../domain/types";
import { createDefaultState } from "../storage/challengeStore";

const mission = (day: number, title: string): DailyMission => ({
  day,
  week: 1,
  title,
  focus: `${title} focus`,
  format: "practice",
  requiresMotion: false,
  full: `${title} full task`,
  minimum: `${title} minimum task`,
  emergency: `${title} emergency task`,
  proofPrompt: `${title} proof prompt`,
});

describe("TodayCommandCenter", () => {
  it("shows tomorrow mission details without marking it done", () => {
    const state: ChallengeState = { ...createDefaultState(), currentDay: 1 };

    render(<TodayCommandCenter mission={mission(1, "Today task")} tomorrowMission={mission(2, "Tomorrow task")} state={state} onChange={vi.fn()} />);

    expect(screen.getByText("พรุ่งนี้")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "วันที่ 2: Tomorrow task" })).toBeInTheDocument();
    expect(screen.getByText("Tomorrow task full task")).toBeInTheDocument();
    expect(screen.queryByText("ส่งหลักฐานแล้ว")).not.toBeInTheDocument();
  });
});
