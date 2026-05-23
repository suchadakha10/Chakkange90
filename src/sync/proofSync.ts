import type { ProofEntry } from "../domain/types";

export interface ProofSyncConfig {
  scriptUrl: string;
  secret: string;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Pick<Response, "ok" | "json" | "status">>;

function cleanScriptUrl(scriptUrl: string): string {
  return scriptUrl.trim().replace(/\?$/, "");
}

export function isProofSyncConfigured(config?: ProofSyncConfig): boolean {
  return Boolean(config?.scriptUrl.trim() && config?.secret.trim());
}

export function mergeProofs(localProofs: ProofEntry[], remoteProofs: ProofEntry[]): ProofEntry[] {
  const byId = new Map<string, ProofEntry>();
  [...localProofs, ...remoteProofs].forEach((proof) => {
    byId.set(proof.id, proof);
  });
  return Array.from(byId.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function pullProofs(config: ProofSyncConfig, fetcher: FetchLike = fetch): Promise<ProofEntry[]> {
  const url = `${cleanScriptUrl(config.scriptUrl)}?action=proofs&secret=${encodeURIComponent(config.secret)}`;
  const response = await fetcher(url);
  if (!response.ok) throw new Error(`โหลด proof จาก Google Sheet ไม่สำเร็จ (${response.status})`);

  const data = (await response.json()) as { proofs?: ProofEntry[] };
  return Array.isArray(data.proofs) ? data.proofs : [];
}

export async function pushProof(config: ProofSyncConfig, proof: ProofEntry, fetcher: FetchLike = fetch): Promise<void> {
  const response = await fetcher(cleanScriptUrl(config.scriptUrl), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "saveProof",
      secret: config.secret,
      proof,
    }),
  });

  if (!response.ok) throw new Error(`ส่ง proof ไป Google Sheet ไม่สำเร็จ (${response.status})`);

  const data = (await response.json()) as { ok?: boolean; error?: string };
  if (!data.ok) throw new Error(data.error || "ส่ง proof ไป Google Sheet ไม่สำเร็จ");
}
