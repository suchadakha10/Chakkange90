import { describe, expect, it } from "vitest";
import { confidenceProofTypeForLevel, getConfidenceContract, getConfidencePhase } from "../domain/confidence";

describe("confidence domain", () => {
  it("selects the correct 30-day confidence phase", () => {
    expect(getConfidencePhase(1)).toMatchObject({ key: "discipline", dayRange: "Day 1-30", startDay: 1, endDay: 30 });
    expect(getConfidencePhase(30)).toMatchObject({ key: "discipline" });
    expect(getConfidencePhase(31)).toMatchObject({ key: "courage", dayRange: "Day 31-60", startDay: 31, endDay: 60 });
    expect(getConfidencePhase(60)).toMatchObject({ key: "courage" });
    expect(getConfidencePhase(61)).toMatchObject({ key: "identity", dayRange: "Day 61-90", startDay: 61, endDay: 90 });
    expect(getConfidencePhase(90)).toMatchObject({ key: "identity" });
  });

  it("builds a daily contract from the active phase", () => {
    const contract = getConfidenceContract(42);

    expect(contract.phase.key).toBe("courage");
    expect(contract.phase.title).toBe("ความกล้า");
    expect(contract.full).toContain("ทำสิ่งที่คนอื่นเห็นได้");
    expect(contract.minimum).toContain("เวอร์ชันเล็ก");
    expect(contract.emergency).toContain("5 นาที");
    expect(contract.proofPrompt).toContain("สิ่งนี้พิสูจน์");
  });

  it("maps confidence task level to shared proof types", () => {
    expect(confidenceProofTypeForLevel("full")).toBe("post");
    expect(confidenceProofTypeForLevel("minimum")).toBe("draft");
    expect(confidenceProofTypeForLevel("emergency")).toBe("lesson");
  });
});
