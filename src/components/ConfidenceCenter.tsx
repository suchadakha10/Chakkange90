import { CheckCircle2, Flame, Send, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { formatChallengeDate } from "../domain/challengeDates";
import { confidencePhases, confidenceProofTypeForLevel, getConfidenceContract } from "../domain/confidence";
import { getCurrentChallengeDay, getEmergencyCountThisWeek, getStreak, getWeekForDay } from "../domain/progress";
import type { ChallengeState, DailyMission, ProofEntry, TaskLevel } from "../domain/types";
import { isProofSyncConfigured, pushProof } from "../sync/proofSync";

interface Props {
  currentMission?: DailyMission;
  state: ChallengeState;
  onChange: (state: ChallengeState) => void;
}

const confidenceReviewPrompts = [
  "สัปดาห์นี้ฉันกล้ากว่าปกติตรงไหน?",
  "หลักฐานไหนบอกว่าฉันรักษาคำพูดกับตัวเองได้?",
  "ฉันยังหลบอะไรอยู่ และก้าวเล็กที่สุดต่อไปคืออะไร?",
];

const taskLevelLabels: Record<TaskLevel, string> = {
  full: "เต็ม",
  minimum: "ขั้นต่ำ",
  emergency: "ฉุกเฉิน",
};

export function ConfidenceCenter({ currentMission, state, onChange }: Props) {
  const [level, setLevel] = useState<TaskLevel>("full");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const week = getWeekForDay(state.currentDay);
  const contract = getConfidenceContract(state.currentDay);
  const streak = getStreak(state.proofs, state.currentDay);
  const emergencyCount = getEmergencyCountThisWeek(state.proofs, week);
  const canSubmit = title.trim().length > 0 && notes.trim().length > 0;
  const selectedTask = contract[level];
  const todayDate = formatChallengeDate(state.startDate, state.currentDay);

  function phaseDateRange(startDay: number, endDay: number): string {
    return `${formatChallengeDate(state.startDate, startDay)} - ${formatChallengeDate(state.startDate, endDay)}`;
  }

  async function submitProof() {
    if (!canSubmit) return;

    const proof: ProofEntry = {
      id: crypto.randomUUID(),
      day: state.currentDay,
      level,
      proofType: confidenceProofTypeForLevel(level),
      title: title.trim(),
      notes: notes.trim(),
      url: url.trim() || undefined,
      createdAt: new Date().toISOString(),
      downgradedFrom: level === "full" ? undefined : "full",
      downgradeReason: level === "full" ? undefined : "ลดขนาดงานความมั่นใจโดยตั้งใจ",
    };

    const nextProofs = [proof, ...state.proofs];
    const nextState = { ...state, proofs: nextProofs, currentDay: getCurrentChallengeDay(nextProofs, state.startDate) };
    onChange(nextState);
    setTitle("");
    setNotes("");
    setUrl("");

    if (!isProofSyncConfigured(state.proofSync)) {
      setSyncMessage("บันทึกในเครื่องนี้แล้ว ถ้าต้องการดูข้ามเครื่องให้ตั้งค่า Sync ในหน้า ตั้งค่า");
      return;
    }

    try {
      setSyncMessage("กำลังส่งหลักฐานไป Google Sheet...");
      await pushProof(state.proofSync, proof);
      onChange({ ...nextState, proofSync: { ...state.proofSync, lastSyncedAt: new Date().toISOString() } });
      setSyncMessage("ส่งหลักฐานไป Google Sheet แล้ว");
    } catch (error) {
      setSyncMessage(error instanceof Error ? `${error.message} แต่หลักฐานถูกเก็บในเครื่องแล้ว` : "ส่ง Google Sheet ไม่สำเร็จ แต่หลักฐานถูกเก็บในเครื่องแล้ว");
    }
  }

  return (
    <div className="page-stack confidence-page">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">ระบบความมั่นใจ</p>
          <h2>ความมั่นใจ 90 วัน</h2>
          <p>{contract.phase.promise}</p>
        </div>
        <div className="metric-row">
          <span>
            <ShieldCheck size={16} /> {contract.phase.title}
          </span>
          <span>
            <Flame size={16} /> ต่อเนื่อง {streak}
          </span>
          <span>ฉุกเฉิน {emergencyCount}/{state.emergencyLimitPerWeek}</span>
        </div>
      </header>

      <section className="panel confidence-hero-panel">
        <div>
          <p className="eyebrow dark">
            {contract.phase.dayRange} - Day {state.currentDay}
          </p>
          <p className="challenge-date">{todayDate}</p>
          <h3>{contract.phase.title}</h3>
          <p>{contract.phase.evidence}</p>
        </div>
        <div className="confidence-proof-count">
          <TrendingUp size={20} />
          <strong>{state.proofs.length}</strong>
          <span>หลักฐานรวม</span>
        </div>
      </section>

      <section className="phase-ladder">
        {confidencePhases.map((phase) => (
          <article key={phase.key} className={`panel phase-card ${phase.key === contract.phase.key ? "is-active" : ""}`}>
            <strong>{phase.dayRange}</strong>
            <small className="challenge-date">{phaseDateRange(phase.startDay, phase.endDay)}</small>
            <h3>{phase.title}</h3>
            <p>{phase.promise}</p>
          </article>
        ))}
      </section>

      {currentMission && (
        <section className="panel confidence-linked-mission">
          <p className="eyebrow dark">งานจากตาราง 90 วัน</p>
          <h3>
            วันที่ {currentMission.day}: {currentMission.title}
          </h3>
          <p className="challenge-date">{todayDate}</p>
          <p>{currentMission.focus}</p>
          <div className="mission-task-grid">
            {(["full", "minimum", "emergency"] as const).map((taskLevel) => (
              <div className="mission-task-card" key={taskLevel}>
                <strong>{taskLevelLabels[taskLevel]}</strong>
                <span>{currentMission[taskLevel]}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h3>สัญญาความมั่นใจวันนี้</h3>
        </div>
        <div className="level-grid">
          {(["full", "minimum", "emergency"] as const).map((taskLevel) => (
            <button key={taskLevel} className={`level-card ${level === taskLevel ? "is-selected" : ""}`} onClick={() => setLevel(taskLevel)} type="button">
              <strong>{taskLevelLabels[taskLevel]}</strong>
              <span>{contract[taskLevel]}</span>
            </button>
          ))}
        </div>
        <p className="selected-task">{selectedTask}</p>
      </section>

      <section className="panel">
        <h3>บันทึกหลักฐานความมั่นใจ</h3>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="คำสัญญาที่รักษาได้วันนี้" />
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="ลิงก์หลักฐานถ้ามี" />
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="บันทึกหลักฐาน" rows={4} />
        <p className="muted">{contract.proofPrompt}</p>
        <div className="action-row">
          <button className="primary-action" disabled={!canSubmit} onClick={submitProof} type="button">
            <Send size={16} /> บันทึกหลักฐานความมั่นใจ
          </button>
        </div>
        {syncMessage && <p className="muted">{syncMessage}</p>}
      </section>

      <section className="panel compact confidence-review-card">
        <CheckCircle2 size={18} />
        <div>
          <strong>รีวิวความมั่นใจประจำสัปดาห์</strong>
          <ul>
            {confidenceReviewPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
