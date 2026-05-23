import type { ProofEntry } from "../domain/types";

export function ProofVault({ proofs }: { proofs: ProofEntry[] }) {
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
