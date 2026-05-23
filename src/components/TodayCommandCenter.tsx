import { AlertTriangle, CheckCircle2, Flame, Send } from "lucide-react";
import { useState } from "react";
import { getEmergencyCountThisWeek, getMotionDrillsThisWeek, getStreak, getWeekForDay, shouldWarnMotionAvoidance } from "../domain/progress";
import type { ChallengeState, DailyMission, ProofEntry, TaskLevel } from "../domain/types";
import { isProofSyncConfigured, pushProof } from "../sync/proofSync";

interface Props {
  mission: DailyMission;
  tomorrowMission?: DailyMission;
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

export function TodayCommandCenter({ mission, tomorrowMission, state, onChange }: Props) {
  const [level, setLevel] = useState<TaskLevel>("full");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const week = getWeekForDay(state.currentDay);
  const streak = getStreak(state.proofs, state.currentDay);
  const emergencyCount = getEmergencyCountThisWeek(state.proofs, week);
  const motionDrills = getMotionDrillsThisWeek(state.proofs, week);
  const motionWarning = shouldWarnMotionAvoidance(state.proofs, state.currentDay, 2);
  const selectedTask = mission[level];
  const dayDone = state.proofs.some((proof) => proof.day === mission.day);
  const canSubmit = title.trim().length > 0 && notes.trim().length > 0;

  async function submitProof() {
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

    const nextState = { ...state, proofs: [proof, ...state.proofs] };
    onChange(nextState);
    setTitle("");
    setNotes("");
    setUrl("");
    setReason("");

    if (!isProofSyncConfigured(state.proofSync)) {
      setSyncMessage("");
      return;
    }

    try {
      setSyncMessage("กำลังส่ง proof ไป Google Sheet...");
      await pushProof(state.proofSync, proof);
      onChange({ ...nextState, proofSync: { ...state.proofSync, lastSyncedAt: new Date().toISOString() } });
      setSyncMessage("ส่ง proof ไป Google Sheet แล้ว");
    } catch (error) {
      setSyncMessage(error instanceof Error ? `${error.message} แต่ proof ถูกเก็บในเครื่องแล้ว` : "ส่ง Google Sheet ไม่สำเร็จ แต่ proof ถูกเก็บในเครื่องแล้ว");
    }
  }

  function goToNextDay() {
    onChange({ ...state, currentDay: Math.min(state.currentDay + 1, 90) });
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">
            วันที่ {mission.day} / สัปดาห์ {mission.week}
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
          สัปดาห์นี้ยังเลี่ยง Motion อยู่ วันนี้ต้องส่งออกงานเล็ก ๆ อย่างน้อย 1 ชิ้น
        </div>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h3>ภารกิจวันนี้</h3>
          {dayDone && (
            <span className="done-pill">
              <CheckCircle2 size={16} /> ส่งหลักฐานแล้ว
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

      {tomorrowMission && (
        <section className="panel tomorrow-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow dark">พรุ่งนี้</p>
              <h3>
                วันที่ {tomorrowMission.day}: {tomorrowMission.title}
              </h3>
            </div>
            {tomorrowMission.requiresMotion && <span className="tag">Motion</span>}
          </div>
          <p>{tomorrowMission.focus}</p>
          <div className="tomorrow-grid">
            <div>
              <strong>FULL</strong>
              <span>{tomorrowMission.full}</span>
            </div>
            <div>
              <strong>MINIMUM</strong>
              <span>{tomorrowMission.minimum}</span>
            </div>
            <div>
              <strong>EMERGENCY</strong>
              <span>{tomorrowMission.emergency}</span>
            </div>
          </div>
        </section>
      )}

      <section className="panel">
        <h3>ส่งหลักฐาน</h3>
        {level !== "full" && <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="เหตุผลที่ลดขนาดงาน" />}
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ชื่อหลักฐาน / ชื่องานที่ทำ" />
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="ลิงก์ถ้ามี" />
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={mission.proofPrompt} rows={4} />
        <div className="action-row">
          <button className="primary-action" disabled={!canSubmit} onClick={submitProof} type="button">
            <Send size={16} /> ส่งหลักฐาน
          </button>
          <button className="secondary-action" disabled={!dayDone || state.currentDay >= 90} onClick={goToNextDay} type="button">
            ไปวันถัดไป
          </button>
        </div>
        {syncMessage && <p className="muted">{syncMessage}</p>}
      </section>

      <section className="panel compact">
        <CheckCircle2 size={18} />
        ถ้าไม่มีหลักฐาน วันนี้ยังไม่นับว่าสำเร็จ
      </section>
    </div>
  );
}
