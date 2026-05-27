import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Settings } from "../components/Settings";
import type { ChallengeState, ProofEntry } from "../domain/types";
import { createDefaultState } from "../storage/challengeStore";

const proof = (day: number): ProofEntry => ({
  id: `proof-${day}`,
  day,
  level: "full",
  proofType: "post",
  title: "Proof",
  notes: "Done",
  createdAt: "2026-05-27T00:00:00.000Z",
});

afterEach(() => cleanup());

describe("Settings", () => {
  it("updates the Day 1 start date without clearing existing proof data", () => {
    const onChange = vi.fn();
    const state: ChallengeState = { ...createDefaultState(), startDate: "2026-05-26", currentDay: 2, proofs: [proof(1)] };

    render(<Settings state={state} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Day 1 start date"), { target: { value: "2026-05-27" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toMatchObject({
      startDate: "2026-05-27",
      proofs: [proof(1)],
    });
  });
});
