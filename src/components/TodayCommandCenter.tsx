import { AlertTriangle, CheckCircle2, Flame, Send } from "lucide-react";
import { useState } from "react";
import { getEmergencyCountThisWeek, getMotionDrillsThisWeek, getStreak, getWeekForDay, shouldWarnMotionAvoidance } from "../domain/progress";
import type { ChallengeState, DailyMission, ProofEntry, TaskLevel } from "../domain/types";

interface Props {
  mission: DailyMission;
  state: ChallengeState;
  onChange: (state: ChallengeState) => void;
}

function proofTypeFor(mission: DailyMission, level: TaskLevel): ProofEntry["proofType"] {
  if (mission.requiresMotion) return "motion-drill";
  if (level === "emergency") return "lesson";
  if (mission.format === "saveable") return "mockup";
  if (mission.format === "talking-head" || mission.format === "screen") return "draft";
  return "draft";
}

export function TodayCommandCenter({ mission, state, onChange }: Props) {
  const [level, setLevel] = useState<TaskLevel>("full");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const week = getWeekForDay(state.currentDay);
  const streak = getStreak(state.proofs, state.currentDay);
  const emergencyCount = getEmergencyCountThisWeek(state.proofs, week);
  const motionDrills = getMotionDrillsThisWeek(state.proofs, week);
  const motionWarning = shouldWarnMotionAvoidance(state.proofs, state.currentDay, 2);
  const selectedTask = mission[level];
  const dayDone = state.proofs.some((proof) => proof.day === mission.day);
  const canSubmit = title.trim().length > 0 && notes.trim().length > 0;

  function submitProof() {
    if (!canSubmit) return;

    const proof: ProofEntry = {
      id: crypto.randomUUID(),
      day: mission.day,
      level,
      proofType: proofTypeFor(mission, level),
      title: title.trim(),
      notes: notes.trim(),
      url: url.trim() || undefined,
      createdAt: new Date().toISOString(),
      downgradedFrom: level === "full" ? undefined : "full",
      downgradeReason: level === "full" ? undefined : reason.trim() || "Time constraint",
    };

    onChange({ ...state, proofs: [proof, ...state.proofs] });
    setTitle("");
    setNotes("");
    setUrl("");
    setReason("");
  }

  function goToNextDay() {
    onChange({ ...state, currentDay: Math.min(state.currentDay + 1, 90) });
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">
            Day {mission.day} / Week {mission.week}
          </p>
          <h2>{mission.title}</h2>
          <p>{mission.focus}</p>
        </div>
        <div className="metric-row">
          <span>
            <Flame size={16} /> Streak {streak}
          </span>
          <span>
            <AlertTriangle size={16} /> Emergency {emergencyCount}/{state.emergencyLimitPerWeek}
          </span>
          <span>Motion {motionDrills}/2</span>
        </div>
      </header>

      {motionWarning && (
        <div className="warning">
          <AlertTriangle size={18} />
          Motion graphic is being avoided this week. Do one small export today.
        </div>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h3>Today's Mission</h3>
          {dayDone && (
            <span className="done-pill">
              <CheckCircle2 size={16} /> Proof submitted
            </span>
          )}
        </div>
        <div className="level-grid">
          {(["full", "minimum", "emergency"] as const).map((taskLevel) => (
            <button
              key={taskLevel}
              className={`level-card ${level === taskLevel ? "is-selected" : ""}`}
              onClick={() => setLevel(taskLevel)}
              type="button"
            >
              <strong>{taskLevel.toUpperCase()}</strong>
              <span>{mission[taskLevel]}</span>
            </button>
          ))}
        </div>
        <p className="selected-task">{selectedTask}</p>
      </section>

      <section className="panel">
        <h3>Submit Proof</h3>
        {level !== "full" && <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for downgrade" />}
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Proof title" />
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Optional link" />
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={mission.proofPrompt} rows={4} />
        <div className="action-row">
          <button className="primary-action" disabled={!canSubmit} onClick={submitProof} type="button">
            <Send size={16} /> Submit proof
          </button>
          <button className="secondary-action" disabled={!dayDone || state.currentDay >= 90} onClick={goToNextDay} type="button">
            Next day
          </button>
        </div>
      </section>

      <section className="panel compact">
        <CheckCircle2 size={18} />
        No proof means today is not done.
      </section>
    </div>
  );
}
