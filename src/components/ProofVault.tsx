import type { ProofEntry } from "../domain/types";

export function ProofVault({ proofs }: { proofs: ProofEntry[] }) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Evidence</p>
          <h2>Proof Vault</h2>
          <p>Every proof entry is a receipt that the chain stayed alive.</p>
        </div>
      </header>
      {proofs.length === 0 ? (
        <section className="panel">No proof yet. Today is not done until proof exists.</section>
      ) : (
        <div className="proof-list">
          {proofs.map((proof) => (
            <section className="panel" key={proof.id}>
              <div className="panel-heading">
                <h3>
                  Day {proof.day}: {proof.title}
                </h3>
                <span className="tag">{proof.proofType}</span>
              </div>
              <p>{proof.notes}</p>
              <p className="muted">
                {proof.level}
                {proof.downgradeReason ? ` / downgraded: ${proof.downgradeReason}` : ""}
              </p>
              {proof.url && <a href={proof.url}>{proof.url}</a>}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
