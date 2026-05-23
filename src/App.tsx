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

const tabs = ["Today", "90-Day Plan", "Motion Track", "Proof Vault", "Review", "Settings"] as const;
type Tab = (typeof tabs)[number];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const [state, setState] = useState<ChallengeState>(() => loadChallengeState());

  useEffect(() => {
    saveChallengeState(state);
  }, [state]);

  const todayMission = useMemo(
    () => seedPlan.weeks.flatMap((week) => week.days).find((day) => day.day === state.currentDay) ?? seedPlan.weeks[0].days[0],
    [state.currentDay],
  );

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <p className="eyebrow">90-Day Strict Coach</p>
        <h1>เทคข้างร้าน</h1>
        <nav>
          {tabs.map((tab) => (
            <button key={tab} className={`nav-button ${activeTab === tab ? "is-active" : ""}`} onClick={() => setActiveTab(tab)} type="button">
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      <section className="workspace">
        {activeTab === "Today" && <TodayCommandCenter mission={todayMission} state={state} onChange={setState} />}
        {activeTab === "90-Day Plan" && <PlanView plan={seedPlan} />}
        {activeTab === "Motion Track" && <MotionTrack state={state} />}
        {activeTab === "Proof Vault" && <ProofVault proofs={state.proofs} />}
        {activeTab === "Review" && <WeeklyReview state={state} onChange={setState} />}
        {activeTab === "Settings" && <Settings state={state} onChange={setState} />}
      </section>
    </main>
  );
}
