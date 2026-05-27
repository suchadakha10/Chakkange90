import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfidenceCenter } from "../components/ConfidenceCenter";
import type { ChallengeState } from "../domain/types";
import { createDefaultState } from "../storage/challengeStore";
import { pushProof } from "../sync/proofSync";

vi.mock("../sync/proofSync", async () => {
  const actual = await vi.importActual<typeof import("../sync/proofSync")>("../sync/proofSync");
  return {
    ...actual,
    pushProof: vi.fn().mockResolvedValue(undefined),
  };
});

describe("ConfidenceCenter", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the current confidence phase and weekly review prompts", () => {
    const state: ChallengeState = { ...createDefaultState(), startDate: "2026-05-26", currentDay: 42 };

    render(<ConfidenceCenter state={state} onChange={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "ความมั่นใจ 90 วัน" })).toBeInTheDocument();
    expect(screen.getAllByText("ความกล้า").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Day 31-60").length).toBeGreaterThan(0);
    expect(screen.getByText("6 ก.ค. 2026")).toBeInTheDocument();
    expect(screen.getByText("25 มิ.ย. 2026 - 24 ก.ค. 2026")).toBeInTheDocument();
    expect(screen.getByText("รีวิวความมั่นใจประจำสัปดาห์")).toBeInTheDocument();
    expect(screen.getByText("สัปดาห์นี้ฉันกล้ากว่าปกติตรงไหน?")).toBeInTheDocument();
  });

  it("submits confidence proof into shared challenge state", () => {
    const onChange = vi.fn();
    const state: ChallengeState = { ...createDefaultState(), startDate: "2026-05-26", currentDay: 31 };

    render(<ConfidenceCenter state={state} onChange={onChange} />);

    fireEvent.click(screen.getAllByRole("button", { name: /ขั้นต่ำ/ })[0]);
    fireEvent.change(screen.getByPlaceholderText("คำสัญญาที่รักษาได้วันนี้"), { target: { value: "อัดคลิปดิบ 1 คลิป" } });
    fireEvent.change(screen.getByPlaceholderText("บันทึกหลักฐาน"), { target: { value: "อัดก่อนพร้อมจริง" } });
    fireEvent.click(screen.getByRole("button", { name: "บันทึกหลักฐานความมั่นใจ" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const nextState = onChange.mock.calls[0][0] as ChallengeState;
    expect(nextState.proofs[0]).toMatchObject({
      day: 31,
      level: "minimum",
      proofType: "draft",
      title: "อัดคลิปดิบ 1 คลิป",
      notes: "อัดก่อนพร้อมจริง",
      downgradedFrom: "full",
    });
  });

  it("pushes confidence proof to the shared sheet when sync is configured", async () => {
    const onChange = vi.fn();
    const state: ChallengeState = {
      ...createDefaultState(),
      currentDay: 31,
      proofSync: {
        scriptUrl: "https://script.google.com/macros/s/demo/exec",
        secret: "shared-secret",
      },
    };

    render(<ConfidenceCenter state={state} onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText("คำสัญญาที่รักษาได้วันนี้"), { target: { value: "อัดคลิปดิบ 1 คลิป" } });
    fireEvent.change(screen.getByPlaceholderText("บันทึกหลักฐาน"), { target: { value: "อัดก่อนพร้อมจริง" } });
    fireEvent.click(screen.getByRole("button", { name: "บันทึกหลักฐานความมั่นใจ" }));

    await waitFor(() => expect(pushProof).toHaveBeenCalledTimes(1));
    expect(pushProof).toHaveBeenCalledWith(
      state.proofSync,
      expect.objectContaining({
        day: 31,
        proofType: "post",
        title: "อัดคลิปดิบ 1 คลิป",
        notes: "อัดก่อนพร้อมจริง",
      }),
    );
    await waitFor(() => expect(screen.getByText("ส่งหลักฐานไป Google Sheet แล้ว")).toBeInTheDocument());
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0].proofSync.lastSyncedAt).toEqual(expect.any(String));
  });
});
