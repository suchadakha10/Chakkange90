import type { ChallengeState } from "../domain/types";
import { resetChallengeState } from "../storage/challengeStore";

export function Settings({ state, onChange }: { state: ChallengeState; onChange: (state: ChallengeState) => void }) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Personal system</p>
          <h2>Settings</h2>
        </div>
      </header>
      <section className="panel">
        <h3>Challenge</h3>
        <p>Start date: {state.startDate}</p>
        <p>Emergency limit: {state.emergencyLimitPerWeek} / week</p>
      </section>
      <section className="panel">
        <h3>Pop Art Minimalist Style Kit</h3>
        <div className="swatch-row">
          {state.styleKit.palette.map((color) => (
            <span key={color} className="swatch" style={{ background: color }} title={color} />
          ))}
        </div>
        <p>{state.styleKit.subtitleRule}</p>
        <p>{state.styleKit.layoutRule}</p>
      </section>
      <section className="panel">
        <button className="secondary-action danger" onClick={() => onChange(resetChallengeState())} type="button">
          Reset challenge data
        </button>
      </section>
    </div>
  );
}
