import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Flame, Pencil, RotateCcw, Save, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { formatChallengeDate } from "../domain/challengeDates";
import { getCurrentChallengeDay, getEmergencyCountThisWeek, getMotionDrillsThisWeek, getStreak, getWeekForDay, shouldWarnMotionAvoidance } from "../domain/progress";
import type { ChallengeState, DailyMission, MissionOverride, ProofEntry, TaskLevel } from "../domain/types";
import { isProofSyncConfigured, pushProof } from "../sync/proofSync";

interface Props {
  mission: DailyMission;
  tomorrowMission?: DailyMission;
  state: ChallengeState;
  onChange: (state: ChallengeState) => void;
  onSaveMissionOverride?: (missionOverride: MissionOverride) => void | Promise<void>;
  onResetMissionOverride?: (day: number) => void | Promise<void>;
}

function proofTypeFor(mission: DailyMission, level: TaskLevel): ProofEntry["proofType"] {
  if (mission.requiresMotion) return "motion-drill";
  if (level === "emergency") return "lesson";
  if (mission.format === "saveable") return "mockup";
  if (mission.format === "talking-head" || mission.format === "screen") return "draft";
  return "draft";
}

export function TodayCommandCenter({ mission, tomorrowMission, state, onChange, onSaveMissionOverride, onResetMissionOverride }: Props) {
  const [level, setLevel] = useState<TaskLevel>("full");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [tomorrowExpanded, setTomorrowExpanded] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [missionDraft, setMissionDraft] = useState({
    title: mission.title,
    focus: mission.focus,
    full: mission.full,
    minimum: mission.minimum,
    emergency: mission.emergency,
    proofPrompt: mission.proofPrompt,
  });
  const week = getWeekForDay(state.currentDay);
  const streak = getStreak(state.proofs, state.currentDay);
  const emergencyCount = getEmergencyCountThisWeek(state.proofs, week);
  const motionDrills = getMotionDrillsThisWeek(state.proofs, week);
  const motionWarning = shouldWarnMotionAvoidance(state.proofs, state.currentDay, 2);
  const selectedTask = mission[level];
  const dayDone = state.proofs.some((proof) => proof.day === mission.day);
  const canSubmit = title.trim().length > 0 && notes.trim().length > 0;
  const canSaveMission = Object.values(missionDraft).every((value) => value.trim().length > 0);
  const todayDate = formatChallengeDate(state.startDate, mission.day);
  const tomorrowDate = tomorrowMission ? formatChallengeDate(state.startDate, tomorrowMission.day) : "";
  const hasMissionOverride = Boolean(state.missionOverrides[String(mission.day)]);

  useEffect(() => {
    setMissionDraft({
      title: mission.title,
      focus: mission.focus,
      full: mission.full,
      minimum: mission.minimum,
      emergency: mission.emergency,
      proofPrompt: mission.proofPrompt,
    });
    setIsEditingMission(false);
  }, [mission.day, mission.title, mission.focus, mission.full, mission.minimum, mission.emergency, mission.proofPrompt]);

  function updateMissionDraft(field: keyof typeof missionDraft, value: string) {
    setMissionDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  }

  async function saveMissionDraft() {
    if (!canSaveMission || !onSaveMissionOverride) return;

    await onSaveMissionOverride({
      day: mission.day,
      title: missionDraft.title.trim(),
      focus: missionDraft.focus.trim(),
      full: missionDraft.full.trim(),
      minimum: missionDraft.minimum.trim(),
      emergency: missionDraft.emergency.trim(),
      proofPrompt: missionDraft.proofPrompt.trim(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditingMission(false);
  }

  async function resetMissionOverride() {
    if (!onResetMissionOverride) return;
    await onResetMissionOverride(mission.day);
    setIsEditingMission(false);
  }

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

    const nextProofs = [proof, ...state.proofs];
    const nextState = { ...state, proofs: nextProofs, currentDay: getCurrentChallengeDay(nextProofs, state.startDate) };
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

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark today-status">
            วันนี้ · วันที่ {mission.day} / สัปดาห์ {mission.week}
          </p>
          <h2>{mission.title}</h2>
          <p className="challenge-date">{todayDate}</p>
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

      <section className="panel today-mission-panel">
        <div className="panel-heading">
          <h3>ภารกิจวันนี้</h3>
          <div className="mission-actions">
            {dayDone && (
              <span className="done-pill">
                <CheckCircle2 size={16} /> ส่งหลักฐานแล้ว
              </span>
            )}
            {onSaveMissionOverride && (
              <button aria-label="Edit today's mission" className="secondary-action compact-action" onClick={() => setIsEditingMission((isEditing) => !isEditing)} type="button">
                <Pencil size={16} /> แก้ไขภารกิจวันนี้
              </button>
            )}
          </div>
        </div>
        {isEditingMission && (
          <div className="mission-editor">
            <label className="field-label">
              ชื่อภารกิจ
              <input aria-label="Mission title" value={missionDraft.title} onChange={(event) => updateMissionDraft("title", event.target.value)} />
            </label>
            <label className="field-label">
              โฟกัส
              <textarea aria-label="Mission focus" value={missionDraft.focus} onChange={(event) => updateMissionDraft("focus", event.target.value)} rows={2} />
            </label>
            <div className="mission-editor-grid">
              <label className="field-label">
                FULL
                <textarea aria-label="FULL" value={missionDraft.full} onChange={(event) => updateMissionDraft("full", event.target.value)} rows={3} />
              </label>
              <label className="field-label">
                MINIMUM
                <textarea aria-label="MINIMUM" value={missionDraft.minimum} onChange={(event) => updateMissionDraft("minimum", event.target.value)} rows={3} />
              </label>
              <label className="field-label">
                EMERGENCY
                <textarea aria-label="EMERGENCY" value={missionDraft.emergency} onChange={(event) => updateMissionDraft("emergency", event.target.value)} rows={3} />
              </label>
            </div>
            <label className="field-label">
              Proof prompt
              <textarea aria-label="Proof prompt" value={missionDraft.proofPrompt} onChange={(event) => updateMissionDraft("proofPrompt", event.target.value)} rows={2} />
            </label>
            <div className="action-row">
              <button aria-label="Save mission" className="primary-action" disabled={!canSaveMission} onClick={saveMissionDraft} type="button">
                <Save size={16} /> บันทึกภารกิจ
              </button>
              {hasMissionOverride && (
                <button aria-label="Reset mission" className="secondary-action" onClick={resetMissionOverride} type="button">
                  <RotateCcw size={16} /> คืนค่าเดิม
                </button>
              )}
            </div>
          </div>
        )}
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
        <section className={`panel tomorrow-panel ${tomorrowExpanded ? "is-expanded" : "is-collapsed"}`}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow dark">พรุ่งนี้</p>
              <h3>
                วันที่ {tomorrowMission.day}: {tomorrowMission.title}
              </h3>
              <p className="challenge-date">{tomorrowDate}</p>
            </div>
            <div className="tomorrow-actions">
              {tomorrowMission.requiresMotion && <span className="tag">Motion</span>}
              <button
                aria-expanded={tomorrowExpanded}
                aria-label={tomorrowExpanded ? "Collapse tomorrow mission" : "Expand tomorrow mission"}
                className="icon-toggle"
                onClick={() => setTomorrowExpanded((isExpanded) => !isExpanded)}
                title={tomorrowExpanded ? "ย่องานพรุ่งนี้" : "ขยายงานพรุ่งนี้"}
                type="button"
              >
                {tomorrowExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>
          {tomorrowExpanded && (
            <div className="tomorrow-expanded-content">
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
            </div>
          )}
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
