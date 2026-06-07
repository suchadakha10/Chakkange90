import { useState } from "react";
import { getCurrentChallengeDay } from "../domain/progress";
import type { ChallengeState } from "../domain/types";
import { resetChallengeState, restartChallengeStateFromToday } from "../storage/challengeStore";
import { isProofSyncConfigured, pullProofs, replaceProofsFromRemote } from "../sync/proofSync";

export function Settings({ state, onChange }: { state: ChallengeState; onChange: (state: ChallengeState) => void }) {
  const [syncMessage, setSyncMessage] = useState("");
  const syncConfigured = isProofSyncConfigured(state.proofSync);

  async function syncProofsNow() {
    if (!syncConfigured) {
      setSyncMessage("ใส่ Google Script URL และ Secret Key ก่อน");
      return;
    }

    try {
      setSyncMessage("กำลังโหลด proof จาก Google Sheet...");
      const remoteProofs = await pullProofs(state.proofSync);
      const nextState = {
        ...state,
        proofs: replaceProofsFromRemote(remoteProofs),
        currentDay: getCurrentChallengeDay(remoteProofs, state.startDate),
        proofSync: { ...state.proofSync, lastSyncedAt: new Date().toISOString() },
      };
      onChange(nextState);
      setSyncMessage(`sync แล้ว: พบ proof ทั้งหมด ${nextState.proofs.length} รายการ`);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "sync ไม่สำเร็จ");
    }
  }

  function updateStartDate(startDate: string) {
    onChange({
      ...state,
      startDate,
      currentDay: getCurrentChallengeDay(state.proofs, startDate),
    });
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">ระบบส่วนตัว</p>
          <h2>ตั้งค่า</h2>
        </div>
      </header>
      <section className="panel">
        <h3>Challenge</h3>
        <label className="field-label">
          Day 1 start date
          <input aria-label="Day 1 start date" inputMode="numeric" pattern="\\d{4}-\\d{2}-\\d{2}" placeholder="YYYY-MM-DD" value={state.startDate} onChange={(event) => updateStartDate(event.target.value)} />
        </label>
        <p>โควตา Emergency: {state.emergencyLimitPerWeek} ครั้ง / สัปดาห์</p>
      </section>
      <section className="panel">
        <h3>Google Sheet Proof Sync</h3>
        <p className="muted">ใช้ Google Apps Script เป็นตัวกลาง ข้อมูล proof จะ sync ข้ามมือถือและคอมได้</p>
        <input
          value={state.proofSync.scriptUrl}
          onChange={(event) => onChange({ ...state, proofSync: { ...state.proofSync, scriptUrl: event.target.value } })}
          placeholder="Google Apps Script Web App URL"
        />
        <input
          value={state.proofSync.secret}
          onChange={(event) => onChange({ ...state, proofSync: { ...state.proofSync, secret: event.target.value } })}
          placeholder="Secret Key"
          type="password"
        />
        <div className="action-row">
          <button className="primary-action" disabled={!syncConfigured} onClick={syncProofsNow} type="button">
            โหลด proof จาก Google Sheet
          </button>
        </div>
        {state.proofSync.lastSyncedAt && <p className="muted">sync ล่าสุด: {new Date(state.proofSync.lastSyncedAt).toLocaleString("th-TH")}</p>}
        {syncMessage && <p className="muted">{syncMessage}</p>}
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
        <button className="secondary-action" onClick={() => onChange(restartChallengeStateFromToday(state))} type="button">
          Restart from today
        </button>
        <button className="secondary-action danger" onClick={() => onChange(resetChallengeState())} type="button">
          รีเซ็ตข้อมูล challenge
        </button>
      </section>
    </div>
  );
}
