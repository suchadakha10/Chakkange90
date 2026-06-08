import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
    const state: ChallengeState = { ...createDefaultState(), startDate: "2026-05-23", currentDay: 1 };

    render(<TodayCommandCenter mission={mission(1, "Today task")} tomorrowMission={mission(2, "Tomorrow task")} state={state} onChange={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /Tomorrow task/ })).toBeInTheDocument();
    expect(screen.getByText("23 พ.ค. 2026")).toBeInTheDocument();
    expect(screen.getByText("24 พ.ค. 2026")).toBeInTheDocument();
    expect(screen.queryByText("Tomorrow task focus")).not.toBeInTheDocument();
    expect(screen.queryByText("Tomorrow task full task")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Expand tomorrow mission" }));
    expect(screen.getByText("Tomorrow task focus")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow task full task")).toBeInTheDocument();
    expect(screen.queryByText("ส่งหลักฐานแล้ว")).not.toBeInTheDocument();
  });

  it("does not show a manual next-day button", () => {
    const state: ChallengeState = { ...createDefaultState(), currentDay: 1 };

    render(<TodayCommandCenter mission={mission(1, "Today task")} tomorrowMission={mission(2, "Tomorrow task")} state={state} onChange={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "ไปวันถัดไป" })).not.toBeInTheDocument();
  });

  it("lets the user edit and save today's system mission", () => {
    const onSaveMissionOverride = vi.fn();
    const state: ChallengeState = { ...createDefaultState(), currentDay: 1 };

    render(
      <TodayCommandCenter
        mission={mission(1, "Today task")}
        tomorrowMission={mission(2, "Tomorrow task")}
        state={state}
        onChange={vi.fn()}
        onSaveMissionOverride={onSaveMissionOverride}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit today's mission" }));
    fireEvent.change(screen.getByLabelText("Mission title"), { target: { value: "ภารกิจที่แก้เอง" } });
    fireEvent.change(screen.getByLabelText("FULL"), { target: { value: "งานแบบเต็มที่แก้เอง" } });
    fireEvent.click(screen.getByRole("button", { name: "Save mission" }));

    expect(onSaveMissionOverride).toHaveBeenCalledWith(
      expect.objectContaining({
        day: 1,
        title: "ภารกิจที่แก้เอง",
        full: "งานแบบเต็มที่แก้เอง",
        updatedAt: expect.any(String),
      }),
    );
  });
});
