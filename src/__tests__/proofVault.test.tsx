import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProofVault } from "../components/ProofVault";
import type { ProofEntry } from "../domain/types";

const proof: ProofEntry = {
  id: "proof-1",
  day: 1,
  level: "full",
  proofType: "post",
  title: "ทดสอบ sync",
  notes: "done",
  createdAt: "2026-05-23T00:00:00.000Z",
};

describe("ProofVault", () => {
  it("calls delete handler when deleting a proof is confirmed", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const onDelete = vi.fn();

    render(<ProofVault proofs={[proof]} onDeleteProof={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "ลบ proof วันที่ 1" }));

    expect(onDelete).toHaveBeenCalledWith(proof);
  });
});
