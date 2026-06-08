import { describe, expect, it, vi } from "vitest";
import { deleteMissionOverride, deleteProof, mergeProofs, pullMissionOverrides, pullProofs, pushMissionOverride, pushProof, replaceProofsFromRemote } from "../sync/proofSync";
import type { MissionOverride, ProofEntry } from "../domain/types";

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

  it("replaces local proofs with remote proofs so deleted sheet rows disappear on every device", () => {
    expect(replaceProofsFromRemote([proof("b", 2), proof("c", 3)]).map((entry) => entry.id)).toEqual(["c", "b"]);
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

  it("pulls mission overrides from Apps Script endpoint", async () => {
    const override: MissionOverride = {
      day: 4,
      title: "Custom mission",
      focus: "Custom focus",
      full: "Custom full",
      minimum: "Custom minimum",
      emergency: "Custom emergency",
      proofPrompt: "Custom proof",
      updatedAt: "2026-06-08T00:00:00.000Z",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ missionOverrides: [override] }),
    });

    const overrides = await pullMissionOverrides({ scriptUrl: "https://script.google.com/macros/s/demo/exec", secret: "abc" }, fetchMock);

    expect(fetchMock).toHaveBeenCalledWith("https://script.google.com/macros/s/demo/exec?action=missionOverrides&secret=abc");
    expect(overrides).toEqual({ "4": override });
  });

  it("rejects unsupported mission override endpoints instead of treating them as empty sync data", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: false, error: "Unknown action" }),
    });

    await expect(pullMissionOverrides({ scriptUrl: "https://script.google.com/macros/s/demo/exec", secret: "abc" }, fetchMock)).rejects.toThrow("Unknown action");
  });

  it("pushes a mission override to Apps Script endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    await pushMissionOverride(
      { scriptUrl: "https://script.google.com/macros/s/demo/exec", secret: "abc" },
      {
        day: 5,
        title: "Custom",
        focus: "Focus",
        full: "Full",
        minimum: "Minimum",
        emergency: "Emergency",
        proofPrompt: "Proof",
        updatedAt: "2026-06-08T00:00:00.000Z",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://script.google.com/macros/s/demo/exec",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"action\":\"saveMissionOverride\""),
      }),
    );
  });

  it("deletes a mission override through Apps Script endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    await deleteMissionOverride({ scriptUrl: "https://script.google.com/macros/s/demo/exec", secret: "abc" }, 5, fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://script.google.com/macros/s/demo/exec",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("\"action\":\"deleteMissionOverride\""),
      }),
    );
  });
});
