import { getMotionDrillsThisWeek, getWeekForDay } from "../domain/progress";
import type { ChallengeState } from "../domain/types";

const ladder = [
  ["L1", "Text pop", "Animate words in and out clearly."],
  ["L2", "Shape + label", "Use bright blocks to point at important ideas."],
  ["L3", "Icon motion", "Move arrows, circles, checks, and simple symbols."],
  ["L4", "Step explainer", "Explain a process in 3 clean steps."],
  ["L5", "Full motion clip", "Make a 20-30 second motion-first explainer."],
] as const;

export function MotionTrack({ state }: { state: ChallengeState }) {
  const week = getWeekForDay(state.currentDay);
  const drills = getMotionDrillsThisWeek(state.proofs, week);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Mandatory skill</p>
          <h2>Motion Track</h2>
          <p>{drills}/2 drills completed this week.</p>
        </div>
      </header>
      <div className="ladder-grid">
        {ladder.map(([level, label, description]) => (
          <section className="panel ladder-card" key={level}>
            <strong>{level}</strong>
            <h3>{label}</h3>
            <p>{description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
