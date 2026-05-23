import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { formatChallengeDate } from "../domain/challengeDates";
import { getCompletedDays, getCompletionPercent, getRemainingDays } from "../domain/progress";
import type { ChallengePlan, ProofEntry } from "../domain/types";

interface Props {
  plan: ChallengePlan;
  proofs: ProofEntry[];
  currentDay: number;
  startDate: string;
}

export function PlanView({ plan, proofs, currentDay, startDate }: Props) {
  const doneDays = new Set(proofs.map((proof) => proof.day));
  const completed = getCompletedDays(proofs);
  const remaining = getRemainingDays(proofs);
  const percent = getCompletionPercent(proofs);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">ตารางจากหลักฐานจริง</p>
          <h2>ตาราง 90 วัน</h2>
          <p>เครื่องหมายถูกจะขึ้นเฉพาะวันที่ส่งงานของวันนั้นแล้วเท่านั้น</p>
        </div>
        <div className="metric-row">
          <span>ทำแล้ว {completed} วัน</span>
          <span>เหลือ {remaining} วัน</span>
          <span>{percent}%</span>
        </div>
      </header>

      <section className="panel progress-panel">
        <div className="progress-track" aria-label={`ความคืบหน้า ${percent}%`}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="muted">ถ้าไม่มี proof วันนั้นจะยังไม่นับว่าสำเร็จ แม้จะเปิดดูตารางแล้วก็ตาม แผนอนาคตปรับได้หลังรีวิวรายสัปดาห์ แต่วันนี้ต้องส่งงานจริง</p>
      </section>

      <div className="week-grid">
        {plan.weeks.map((week) => (
          <section className="panel" key={week.week}>
            <h3>
              สัปดาห์ {week.week}: {week.theme}
            </h3>
            <p>{week.outcome}</p>
            <div className="day-grid">
              {week.days.map((day) => (
                <div
                  aria-label={doneDays.has(day.day) ? `วันที่ ${day.day} ทำเสร็จแล้ว` : `วันที่ ${day.day} ยังไม่เสร็จ`}
                  className={`day-cell ${doneDays.has(day.day) ? "is-done" : ""} ${day.day === currentDay ? "is-current" : ""}`}
                  key={day.day}
                  title={day.title}
                >
                  <div className="day-cell-top">
                    <strong>วันที่ {day.day}</strong>
                    {doneDays.has(day.day) ? <CheckCircle2 size={18} /> : day.day === currentDay ? <Clock3 size={18} /> : <Circle size={18} />}
                  </div>
                  <small>{formatChallengeDate(startDate, day.day)}</small>
                  <span className="day-title">{day.title}</span>
                  <span className="day-work">
                    <strong>งาน:</strong> {day.full}
                  </span>
                  {day.requiresMotion && <em>Motion</em>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
