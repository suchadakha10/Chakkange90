import { getMotionDrillsThisWeek, getWeekForDay } from "../domain/progress";
import type { ChallengeState } from "../domain/types";

const ladder = [
  ["L1", "Text pop", "ทำให้คำเด้งเข้าออกแบบอ่านง่าย"],
  ["L2", "Shape + label", "ใช้กล่องสี/ป้ายกำกับชี้จุดสำคัญ"],
  ["L3", "Icon motion", "ขยับลูกศร วงกลม เครื่องหมายถูก หรือไอคอนง่าย ๆ"],
  ["L4", "Step explainer", "อธิบายขั้นตอนให้จบใน 3 สเต็ป"],
  ["L5", "Full motion clip", "ทำคลิป motion-first 20-30 วินาที"],
] as const;

export function MotionTrack({ state }: { state: ChallengeState }) {
  const week = getWeekForDay(state.currentDay);
  const drills = getMotionDrillsThisWeek(state.proofs, week);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">สกิลบังคับ</p>
          <h2>Motion Track</h2>
          <p>สัปดาห์นี้ทำ motion drill แล้ว {drills}/2 งาน</p>
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
