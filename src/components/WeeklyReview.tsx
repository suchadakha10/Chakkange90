import { useState } from "react";
import { getCompletedDays, getMotionDrillsThisWeek, getWeekForDay } from "../domain/progress";
import type { ChallengeState, WeeklyReviewEntry } from "../domain/types";

export function WeeklyReview({ state, onChange }: { state: ChallengeState; onChange: (state: ChallengeState) => void }) {
  const week = getWeekForDay(state.currentDay);
  const [bestSignal, setBestSignal] = useState("");
  const [avoided, setAvoided] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const completedDays = getCompletedDays(state.proofs);
  const motionDrills = getMotionDrillsThisWeek(state.proofs, week);
  const canSubmit = bestSignal.trim() && avoided.trim() && adjustment.trim();

  function submitReview() {
    if (!canSubmit) return;

    const review: WeeklyReviewEntry = {
      week,
      completedDays,
      postsPublished: state.proofs.filter((proof) => proof.proofType === "post").length,
      motionDrills,
      bestSignal,
      avoided,
      adjustment,
      createdAt: new Date().toISOString(),
    };

    onChange({ ...state, weeklyReviews: [review, ...state.weeklyReviews] });
    setBestSignal("");
    setAvoided("");
    setAdjustment("");
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Week {week}</p>
          <h2>รีวิวรายสัปดาห์</h2>
          <p>
            ทำแล้ว {completedDays} วัน / motion drill สัปดาห์นี้ {motionDrills} งาน
          </p>
        </div>
      </header>
      <section className="panel">
        <textarea value={bestSignal} onChange={(event) => setBestSignal(event.target.value)} placeholder="สัญญาณที่ดีที่สุดจากคนดูหรือจากการฝึกของตัวเอง" rows={3} />
        <textarea value={avoided} onChange={(event) => setAvoided(event.target.value)} placeholder="สัปดาห์นี้เลี่ยงอะไร" rows={3} />
        <textarea value={adjustment} onChange={(event) => setAdjustment(event.target.value)} placeholder="สัปดาห์หน้าจะปรับ 1 เรื่องอะไร" rows={3} />
        <button className="primary-action" disabled={!canSubmit} onClick={submitReview} type="button">
          บันทึกรีวิวสัปดาห์
        </button>
      </section>
      <div className="proof-list">
        {state.weeklyReviews.map((review) => (
          <section className="panel" key={`${review.week}-${review.createdAt}`}>
            <h3>สัปดาห์ {review.week}</h3>
            <p>{review.bestSignal}</p>
            <p className="muted">สิ่งที่เลี่ยง: {review.avoided}</p>
            <p className="muted">รอบหน้า: {review.adjustment}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
