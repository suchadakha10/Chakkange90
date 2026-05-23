import { useEffect, useMemo, useState } from "react";
import { MotionTrack } from "./components/MotionTrack";
import { PlanView } from "./components/PlanView";
import { ProofVault } from "./components/ProofVault";
import { Settings } from "./components/Settings";
import { TodayCommandCenter } from "./components/TodayCommandCenter";
import { WeeklyReview } from "./components/WeeklyReview";
import { seedPlan } from "./domain/seedPlan";
import type { ChallengeState } from "./domain/types";
import { loadChallengeState, saveChallengeState } from "./storage/challengeStore";

const tabs = ["วันนี้", "ตาราง 90 วัน", "Motion", "หลักฐาน", "รีวิว", "ตั้งค่า"] as const;
type Tab = (typeof tabs)[number];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("วันนี้");
  const [state, setState] = useState<ChallengeState>(() => loadChallengeState());

  useEffect(() => {
    saveChallengeState(state);
  }, [state]);

  const missions = useMemo(() => seedPlan.weeks.flatMap((week) => week.days), []);
  const todayMission = useMemo(() => missions.find((day) => day.day === state.currentDay) ?? missions[0], [missions, state.currentDay]);
  const tomorrowMission = useMemo(() => missions.find((day) => day.day === state.currentDay + 1), [missions, state.currentDay]);

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
        {activeTab === "วันนี้" && <TodayCommandCenter mission={todayMission} tomorrowMission={tomorrowMission} state={state} onChange={setState} />}
        {activeTab === "ตาราง 90 วัน" && <PlanView plan={seedPlan} proofs={state.proofs} currentDay={state.currentDay} startDate={state.startDate} />}
        {activeTab === "Motion" && <MotionTrack state={state} />}
        {activeTab === "หลักฐาน" && <ProofVault proofs={state.proofs} />}
        {activeTab === "รีวิว" && <WeeklyReview state={state} onChange={setState} />}
        {activeTab === "ตั้งค่า" && <Settings state={state} onChange={setState} />}
      </section>
    </main>
  );
}
