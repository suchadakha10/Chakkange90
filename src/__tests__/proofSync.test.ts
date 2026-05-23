import { describe, expect, it, vi } from "vitest";
import { deleteProof, mergeProofs, pullProofs, pushProof } from "../sync/proofSync";
import type { ProofEntry } from "../domain/types";

const proof = (id: string, day: number): ProofEntry => ({
  id,
  day,
  level: "full",
  proofType: "post",
  title: `proof ${id}`,
  notes: "done",
  createdAt: `2026-05-${String(day).padStart(2, "0")}T00:00:00.000Z`,
});

describe("proofSync", () => {
  it("merges remote and local proofs without duplicating ids", () => {
    expect(mergeProofs([proof("a", 1), proof("b", 2)], [proof("b", 2), proof("c", 3)]).map((entry) => entry.id)).toEqual(["c", "b", "a"]);
  });

  it("pulls proofs from Apps Script endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ proofs: [proof("remote", 1)] }),
    });

    const proofs = await pullProofs({ scriptUrl: "https://script.google.com/macros/s/demo/exec", secret: "abc" }, fetchMock);

    expect(fetchMock).toHaveBeenCalledWith("https://script.google.com/macros/s/demo/exec?action=proofs&secret=abc");
    expect(proofs[0].id).toBe("remote");
  });

  it("pushes a proof to Apps Script endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    await pushProof({ scriptUrl: "https://script.google.com/macros/s/demo/exec", secret: "abc" }, proof("local", 1), fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://script.google.com/macros/s/demo/exec",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"action\":\"saveProof\""),
      }),
    );
  });

  it("deletes a proof through Apps Script endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    await deleteProof({ scriptUrl: "https://script.google.com/macros/s/demo/exec", secret: "abc" }, "local", fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://script.google.com/macros/s/demo/exec",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"action\":\"deleteProof\""),
      }),
    );
  });
});
