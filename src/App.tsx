import { useEffect, useMemo, useState } from "react";
import { ConfidenceCenter } from "./components/ConfidenceCenter";
import { ContentStudio } from "./components/ContentStudio";
import { MotionTrack } from "./components/MotionTrack";
import { PlanView } from "./components/PlanView";
import { ProofVault } from "./components/ProofVault";
import { Settings } from "./components/Settings";
import { TodayCommandCenter } from "./components/TodayCommandCenter";
import { WeeklyReview } from "./components/WeeklyReview";
import { planWithMissionOverrides } from "./domain/missionOverrides";
import { seedPlan } from "./domain/seedPlan";
import type { ChallengeState, MissionOverride } from "./domain/types";
import { getCurrentChallengeDay } from "./domain/progress";
import { loadChallengeState, saveChallengeState } from "./storage/challengeStore";
import { deleteMissionOverride, deleteProof, isProofSyncConfigured, pullMissionOverrides, pullProofs, pushMissionOverride, replaceProofsFromRemote } from "./sync/proofSync";

const tabs = ["วันนี้", "Confidence", "ตาราง 90 วัน", "Motion", "Content Studio", "หลักฐาน", "รีวิว", "ตั้งค่า"] as const;
type Tab = (typeof tabs)[number];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("วันนี้");
  const [state, setState] = useState<ChallengeState>(() => loadChallengeState());

  useEffect(() => {
    saveChallengeState(state);
  }, [state]);

  useEffect(() => {
    if (!isProofSyncConfigured(state.proofSync)) return;

    let isCancelled = false;
    Promise.all([pullProofs(state.proofSync), pullMissionOverrides(state.proofSync)])
      .then(([remoteProofs, remoteMissionOverrides]) => {
        if (isCancelled) return;
        setState((currentState) => ({
          ...currentState,
          proofs: replaceProofsFromRemote(remoteProofs),
          missionOverrides: remoteMissionOverrides,
          currentDay: getCurrentChallengeDay(remoteProofs, currentState.startDate),
          proofSync: { ...currentState.proofSync, lastSyncedAt: new Date().toISOString() },
        }));
      })
      .catch(() => {
        // Keep local proof data usable even when the sheet is temporarily unreachable.
      });

    return () => {
      isCancelled = true;
    };
  }, [state.proofSync.scriptUrl, state.proofSync.secret]);

  const plan = useMemo(() => planWithMissionOverrides(seedPlan, state.missionOverrides), [state.missionOverrides]);
  const missions = useMemo(() => plan.weeks.flatMap((week) => week.days), [plan]);
  const todayMission = useMemo(() => missions.find((day) => day.day === state.currentDay) ?? missions[0], [missions, state.currentDay]);
  const tomorrowMission = useMemo(() => missions.find((day) => day.day === state.currentDay + 1), [missions, state.currentDay]);

  async function handleSaveMissionOverride(missionOverride: MissionOverride) {
    setState((currentState) => ({
      ...currentState,
      missionOverrides: {
        ...currentState.missionOverrides,
        [String(missionOverride.day)]: missionOverride,
      },
    }));

    if (!isProofSyncConfigured(state.proofSync)) return;

    try {
      await pushMissionOverride(state.proofSync, missionOverride);
      setState((currentState) => ({
        ...currentState,
        proofSync: { ...currentState.proofSync, lastSyncedAt: new Date().toISOString() },
      }));
    } catch {
      // Keep the local edit available even if the sync endpoint is temporarily unreachable.
    }
  }

  async function handleResetMissionOverride(day: number) {
    setState((currentState) => {
      const nextMissionOverrides = { ...currentState.missionOverrides };
      delete nextMissionOverrides[String(day)];
      return {
        ...currentState,
        missionOverrides: nextMissionOverrides,
      };
    });

    if (!isProofSyncConfigured(state.proofSync)) return;

    try {
      await deleteMissionOverride(state.proofSync, day);
      setState((currentState) => ({
        ...currentState,
        proofSync: { ...currentState.proofSync, lastSyncedAt: new Date().toISOString() },
      }));
    } catch {
      // Keep the local reset applied even if the remote sheet is temporarily unreachable.
    }
  }

  async function handleDeleteProof(proofId: string) {
    setState((currentState) => {
      const nextProofs = currentState.proofs.filter((proof) => proof.id !== proofId);
      return {
        ...currentState,
        proofs: nextProofs,
        currentDay: getCurrentChallengeDay(nextProofs, currentState.startDate),
      };
    });

    if (!isProofSyncConfigured(state.proofSync)) return;

    try {
      await deleteProof(state.proofSync, proofId);
      setState((currentState) => ({
        ...currentState,
        proofSync: { ...currentState.proofSync, lastSyncedAt: new Date().toISOString() },
      }));
    } catch {
      // Keep the local delete applied even if the remote sheet is temporarily unreachable.
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <p className="eyebrow">90-Day Strict Coach</p>
        <h1>เทคข้างร้าน</h1>
        <p className="sidebar-note">ทำงานให้ครบ 90 วัน โดยนับจากหลักฐานจริงเท่านั้น</p>
        <nav>
          {tabs.map((tab) => (
            <button key={tab} className={`nav-button ${activeTab === tab ? "is-active" : ""}`} onClick={() => setActiveTab(tab)} type="button">
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      <section className="workspace">
        {activeTab === "วันนี้" && (
          <TodayCommandCenter
            mission={todayMission}
            tomorrowMission={tomorrowMission}
            state={state}
            onChange={setState}
            onSaveMissionOverride={handleSaveMissionOverride}
            onResetMissionOverride={handleResetMissionOverride}
          />
        )}
        {activeTab === "Confidence" && <ConfidenceCenter currentMission={todayMission} state={state} onChange={setState} />}
        {activeTab === "ตาราง 90 วัน" && <PlanView plan={plan} proofs={state.proofs} currentDay={state.currentDay} startDate={state.startDate} />}
        {activeTab === "Motion" && <MotionTrack state={state} />}
        {activeTab === "Content Studio" && <ContentStudio />}
        {activeTab === "หลักฐาน" && <ProofVault proofs={state.proofs} onDeleteProof={(proof) => handleDeleteProof(proof.id)} />}
        {activeTab === "รีวิว" && <WeeklyReview state={state} onChange={setState} />}
        {activeTab === "ตั้งค่า" && <Settings state={state} onChange={setState} />}
      </section>
    </main>
  );
}
