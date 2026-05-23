import { Trash2 } from "lucide-react";
import type { ProofEntry } from "../domain/types";

export function ProofVault({ proofs, onDeleteProof }: { proofs: ProofEntry[]; onDeleteProof?: (proof: ProofEntry) => void }) {
  function confirmDelete(proof: ProofEntry) {
    if (!onDeleteProof) return;
    const confirmed = window.confirm(`ลบ proof วันที่ ${proof.day}: ${proof.title} ใช่ไหม`);
    if (confirmed) onDeleteProof(proof);
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Evidence</p>
          <h2>คลังหลักฐาน</h2>
          <p>ทุกหลักฐานคือใบเสร็จว่าวันนั้นทำงานจริง</p>
        </div>
      </header>
      {proofs.length === 0 ? (
        <section className="panel">ยังไม่มีหลักฐาน วันนี้จะยังไม่ถูกนับว่าสำเร็จจนกว่าจะส่ง proof</section>
      ) : (
        <div className="proof-list">
          {proofs.map((proof) => (
            <section className="panel" key={proof.id}>
              <div className="panel-heading">
                <h3>
                  วันที่ {proof.day}: {proof.title}
                </h3>
                <span className="tag">{proof.proofType}</span>
              </div>
              <p>{proof.notes}</p>
              <p className="muted">
                {proof.level}
                {proof.downgradeReason ? ` / ลดขนาดงาน: ${proof.downgradeReason}` : ""}
              </p>
              {proof.url && <a href={proof.url}>{proof.url}</a>}
              {onDeleteProof && (
                <div className="action-row">
                  <button className="secondary-action danger" onClick={() => confirmDelete(proof)} type="button" aria-label={`ลบ proof วันที่ ${proof.day}`}>
                    <Trash2 size={16} /> ลบ proof
                  </button>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
