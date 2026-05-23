import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlanView } from "../components/PlanView";
import { seedPlan } from "../domain/seedPlan";
import type { ProofEntry } from "../domain/types";

const proof = (day: number): ProofEntry => ({
  id: `proof-${day}`,
  day,
  level: "full",
  proofType: "post",
  title: "ส่งงานแล้ว",
  notes: "done",
  createdAt: "2026-05-23T00:00:00.000Z",
});

describe("PlanView", () => {
  it("shows completed and remaining days from submitted proofs", () => {
    render(<PlanView plan={seedPlan} proofs={[proof(1), proof(1), proof(2)]} currentDay={3} startDate="2026-05-23" />);

    expect(screen.getByText("ทำแล้ว 2 วัน")).toBeInTheDocument();
    expect(screen.getByText("เหลือ 88 วัน")).toBeInTheDocument();
    expect(screen.getByLabelText("วันที่ 1 ทำเสร็จแล้ว")).toBeInTheDocument();
    expect(screen.getByLabelText("วันที่ 3 ยังไม่เสร็จ")).toBeInTheDocument();
  });

  it("shows the calendar date for each challenge day", () => {
    render(<PlanView plan={seedPlan} proofs={[]} currentDay={1} startDate="2026-05-23" />);

    expect(screen.getByLabelText("วันที่ 1 ยังไม่เสร็จ")).toHaveTextContent("23 พ.ค. 2026");
    expect(screen.getByLabelText("วันที่ 2 ยังไม่เสร็จ")).toHaveTextContent("24 พ.ค. 2026");
  });
});
