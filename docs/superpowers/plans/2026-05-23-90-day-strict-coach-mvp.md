# 90-Day Strict Coach MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal 90-day execution web app that shows today's mission, tracks proof, enforces motion graphic drills, supports downgrade days, and runs weekly reviews.

**Architecture:** Use a mobile-first, client-only React PWA with a typed domain layer, deterministic seed data for the 90-day plan, and localStorage persistence. Keep business rules in focused TypeScript modules so the UI stays simple, Android home-screen use is possible, and future notification/backend migration remains possible.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, localStorage, Web App Manifest, Service Worker.

---

## File Structure

- `package.json`: scripts and dependencies.
- `index.html`: Vite HTML shell.
- `public/manifest.webmanifest`: Android home-screen install metadata.
- `public/sw.js`: simple service worker foundation for offline shell caching and future notification work.
- `src/main.tsx`: React entry.
- `src/App.tsx`: page shell and route-like tab state.
- `src/styles.css`: app styling for a dense personal cockpit.
- `src/domain/types.ts`: shared challenge types.
- `src/domain/seedPlan.ts`: 13-week plan and Week 1 CapCut Production Sprint.
- `src/domain/progress.ts`: completion, streak, downgrade, and motion warning rules.
- `src/storage/challengeStore.ts`: localStorage load/save/reset helpers.
- `src/components/TodayCommandCenter.tsx`: daily mission, proof submit, downgrade controls.
- `src/components/PlanView.tsx`: 90-day weekly/day plan.
- `src/components/MotionTrack.tsx`: motion ladder and weekly drill status.
- `src/components/ProofVault.tsx`: proof history.
- `src/components/WeeklyReview.tsx`: 7-day review form and next-week lock.
- `src/components/Settings.tsx`: challenge start date and style kit settings.
- `src/__tests__/progress.test.ts`: business-rule tests.
- `src/__tests__/seedPlan.test.ts`: seed-plan tests.
- `src/__tests__/storage.test.ts`: storage tests with localStorage.

---

### Task 1: Scaffold The Mobile-First PWA React App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create package manifest**

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest --run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create Vite HTML shell**

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#111111" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>90-Day Strict Coach</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create PWA manifest**

```json
{
  "name": "90-Day Strict Coach",
  "short_name": "Strict Coach",
  "description": "Personal 90-day execution cockpit for เทคข้างร้าน content practice.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#f7f7f2",
  "theme_color": "#111111",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 4: Create service worker foundation**

```js
const CACHE_NAME = "strict-coach-shell-v1";
const SHELL_ASSETS = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then((response) => response || caches.match("/"))));
});
```

- [ ] **Step 5: Create React entry and register service worker**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
```

- [ ] **Step 6: Create initial app shell**

```tsx
const tabs = ["Today", "90-Day Plan", "Motion Track", "Proof Vault", "Review", "Settings"] as const;

export default function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <p className="eyebrow">90-Day Strict Coach</p>
        <h1>เทคข้างร้าน</h1>
        <nav>
          {tabs.map((tab) => (
            <button key={tab} className="nav-button" type="button">
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      <section className="workspace">
        <h2>Today Command Center</h2>
        <p>Day 1 starts here.</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Add mobile-first base styling**

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #111111;
  background: #f7f7f2;
}

body {
  margin: 0;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #111111;
  color: #ffffff;
  padding: 24px;
}

.eyebrow {
  color: #ffdd00;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.sidebar h1 {
  font-size: 26px;
  line-height: 1.15;
  margin: 0 0 24px;
}

.sidebar nav {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.nav-button {
  background: transparent;
  border: 1px solid #393939;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  padding: 10px 12px;
  text-align: left;
}

.nav-button:hover,
.nav-button.is-active {
  background: #ffdd00;
  border-color: #ffdd00;
  color: #111111;
}

.workspace {
  padding: 16px;
}

@media (min-width: 860px) {
  .app-shell {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .sidebar nav {
    grid-template-columns: 1fr;
  }

  .workspace {
    padding: 28px;
  }
}
```

- [ ] **Step 8: Install dependencies and verify**

Run: `npm install`

Run: `npm run build`

Expected: build exits successfully and creates `dist/`.

---

### Task 2: Define Domain Types And Seed Plan

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/seedPlan.ts`
- Create: `src/__tests__/seedPlan.test.ts`

- [ ] **Step 1: Write seed-plan tests**

```ts
import { describe, expect, it } from "vitest";
import { seedPlan } from "../domain/seedPlan";

describe("seedPlan", () => {
  it("contains 13 weeks and 90 days", () => {
    expect(seedPlan.weeks).toHaveLength(13);
    const days = seedPlan.weeks.flatMap((week) => week.days);
    expect(days).toHaveLength(90);
    expect(days[0].title).toBe("Baseline Clip Test");
  });

  it("makes Week 1 a CapCut Production Sprint with motion work", () => {
    expect(seedPlan.weeks[0].theme).toBe("CapCut Production Sprint");
    const weekOneMotionDays = seedPlan.weeks[0].days.filter((day) => day.requiresMotion);
    expect(weekOneMotionDays.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/__tests__/seedPlan.test.ts`

Expected: FAIL because `src/domain/seedPlan.ts` does not exist.

- [ ] **Step 3: Add shared types**

```ts
export type TaskLevel = "full" | "minimum" | "emergency";

export type ClipFormat = "motion" | "screen" | "talking-head" | "saveable" | "practice";

export interface DailyMission {
  day: number;
  week: number;
  title: string;
  focus: string;
  format: ClipFormat;
  requiresMotion: boolean;
  full: string;
  minimum: string;
  emergency: string;
  proofPrompt: string;
}

export interface ChallengeWeek {
  week: number;
  theme: string;
  outcome: string;
  days: DailyMission[];
}

export interface ChallengePlan {
  weeks: ChallengeWeek[];
}

export interface ProofEntry {
  id: string;
  day: number;
  level: TaskLevel;
  proofType: "post" | "draft" | "motion-drill" | "script" | "hook" | "mockup" | "lesson";
  title: string;
  notes: string;
  url?: string;
  createdAt: string;
  downgradedFrom?: TaskLevel;
  downgradeReason?: string;
}

export interface WeeklyReviewEntry {
  week: number;
  completedDays: number;
  postsPublished: number;
  motionDrills: number;
  bestSignal: string;
  avoided: string;
  adjustment: string;
  createdAt: string;
}

export interface ChallengeState {
  startDate: string;
  currentDay: number;
  proofs: ProofEntry[];
  weeklyReviews: WeeklyReviewEntry[];
  emergencyLimitPerWeek: number;
  styleKit: {
    palette: string[];
    subtitleRule: string;
    layoutRule: string;
  };
}
```

- [ ] **Step 4: Add seed plan generator**

```ts
import type { ChallengePlan, ChallengeWeek, ClipFormat, DailyMission } from "./types";

const weekThemes = [
  ["CapCut Production Sprint", "2 posted clips, 2 motion drills, 1 reusable style template"],
  ["Back To Shop Prep", "Capture shop-related raw material and small-shop pain points"],
  ["Canva For Small Shops", "Teach practical designs sellers can use immediately"],
  ["Print File Mistakes", "Explain common file problems before printing"],
  ["AI For Shop Content", "Use AI for hooks, captions, scripts, and workflows"],
  ["Print Product Basics", "Teach simple print products such as cards, stickers, and flyers"],
  ["Before And After", "Show visible improvements in shop content and print files"],
  ["Customer Questions", "Turn questions into useful short videos"],
  ["Workflow Systems", "Teach file organization, handoff, and repeatable processes"],
  ["Offer Building", "Package content and print help for small shops"],
  ["Print-Shop Preparation", "Learn before buying equipment"],
  ["Authority Series", "Teach a connected mini-series with confidence"],
  ["Review And Best Of", "Summarize the 90-day journey and strongest lessons"],
] as const;

const weekOne: Omit<DailyMission, "day" | "week">[] = [
  {
    title: "Baseline Clip Test",
    focus: "Measure current editing speed and quality.",
    format: "practice",
    requiresMotion: false,
    full: "Edit one 30-45 second clip and time the full workflow from import to export.",
    minimum: "Edit a 15-second draft and write what slowed you down.",
    emergency: "Trim one raw clip and export a 5-second proof.",
    proofPrompt: "Submit export name, time spent, and one editing bottleneck.",
  },
  {
    title: "Hook And Pacing Drill",
    focus: "Improve the first 3 seconds and remove dead air.",
    format: "practice",
    requiresMotion: false,
    full: "Create 3 opening versions from the same clip and choose the strongest.",
    minimum: "Create 2 openings and write why one is stronger.",
    emergency: "Write 3 hook lines for the same topic.",
    proofPrompt: "Submit hook versions or exported draft.",
  },
  {
    title: "Subtitle Style System",
    focus: "Create reusable readable subtitles for the channel.",
    format: "saveable",
    requiresMotion: false,
    full: "Build subtitle style with font size, color, position, and highlight rule.",
    minimum: "Create one subtitle preset and test it on 10 seconds of video.",
    emergency: "Define subtitle size, color, and max 2-line rule in notes.",
    proofPrompt: "Submit screenshot or short export showing subtitle style.",
  },
  {
    title: "Motion Text Pop Drill",
    focus: "Start motion graphic skill ladder at L1.",
    format: "motion",
    requiresMotion: true,
    full: "Create 3 text pop animations and export a 5-10 second motion drill.",
    minimum: "Create 1 text pop animation and export it.",
    emergency: "Storyboard 3 frames for a text pop animation.",
    proofPrompt: "Submit exported motion drill or storyboard proof.",
  },
  {
    title: "Screen Tutorial Clip",
    focus: "Make one useful tutorial for small shops.",
    format: "screen",
    requiresMotion: false,
    full: "Record and edit a short screen tutorial, then post or prepare it for posting.",
    minimum: "Record screen and edit the first 20 seconds.",
    emergency: "Write the tutorial script in Hook/Problem/Steps/CTA format.",
    proofPrompt: "Submit post link, draft export, or script.",
  },
  {
    title: "Motion In Real Clip",
    focus: "Use motion inside an actual content piece.",
    format: "motion",
    requiresMotion: true,
    full: "Add a motion label, arrow, or step card into a real clip and export it.",
    minimum: "Add one motion label into a 10-second draft.",
    emergency: "Create one animated label export without the full clip.",
    proofPrompt: "Submit clip export or motion overlay export.",
  },
  {
    title: "Template And Shot List",
    focus: "Prepare for next week and returning to shop content.",
    format: "practice",
    requiresMotion: false,
    full: "Create one reusable CapCut template and a shop shot list for next week.",
    minimum: "Create either the template or a 10-item shot list.",
    emergency: "Write 5 shots to capture when back at the shop.",
    proofPrompt: "Submit template note, screenshot, or shot list.",
  },
];

function makeFallbackDay(day: number, week: number, theme: string): DailyMission {
  const rotation: ClipFormat[] = ["motion", "screen", "talking-head", "saveable", "practice", "screen", "practice"];
  const format = rotation[(day - 1) % rotation.length];
  const requiresMotion = format === "motion";
  return {
    day,
    week,
    title: `${theme} Day ${((day - 1) % 7) + 1}`,
    focus: `Produce one useful เทคข้างร้าน asset for ${theme}.`,
    format,
    requiresMotion,
    full: requiresMotion
      ? "Create a small motion graphic segment and connect it to a useful content idea."
      : "Create or post one complete content asset for small shops.",
    minimum: requiresMotion
      ? "Export one 5-10 second motion drill."
      : "Write one script, record one raw clip, or create one usable mockup.",
    emergency: requiresMotion
      ? "Storyboard 3 motion frames or animate one text pop."
      : "Write one hook or one lesson learned.",
    proofPrompt: "Submit link, export note, screenshot, script, hook, or lesson proof.",
  };
}

function buildWeeks(): ChallengeWeek[] {
  let day = 1;
  return weekThemes.map(([theme, outcome], index) => {
    const week = index + 1;
    const dayCount = week === 13 ? 6 : 7;
    const days = Array.from({ length: dayCount }, (_, dayIndex) => {
      if (week === 1) {
        const mission = weekOne[dayIndex];
        return { ...mission, day: day++, week };
      }
      return makeFallbackDay(day++, week, theme);
    });
    return { week, theme, outcome, days };
  });
}

export const seedPlan: ChallengePlan = {
  weeks: buildWeeks(),
};
```

- [ ] **Step 5: Run seed-plan tests**

Run: `npm test -- src/__tests__/seedPlan.test.ts`

Expected: PASS.

---

### Task 3: Add Progress Rules

**Files:**
- Create: `src/domain/progress.ts`
- Create: `src/__tests__/progress.test.ts`

- [ ] **Step 1: Write progress-rule tests**

```ts
import { describe, expect, it } from "vitest";
import { getCompletedDays, getMotionDrillsThisWeek, getStreak, shouldWarnMotionAvoidance } from "../domain/progress";
import type { ProofEntry } from "../domain/types";

const proof = (day: number, proofType: ProofEntry["proofType"] = "post"): ProofEntry => ({
  id: `p-${day}-${proofType}`,
  day,
  level: "full",
  proofType,
  title: "Proof",
  notes: "Done",
  createdAt: "2026-05-23T00:00:00.000Z",
});

describe("progress rules", () => {
  it("counts unique completed days", () => {
    expect(getCompletedDays([proof(1), proof(1, "hook"), proof(2)])).toBe(2);
  });

  it("calculates streak ending at the current day", () => {
    expect(getStreak([proof(1), proof(2), proof(4)], 4)).toBe(1);
    expect(getStreak([proof(1), proof(2), proof(3)], 3)).toBe(3);
  });

  it("counts motion drills inside a week", () => {
    expect(getMotionDrillsThisWeek([proof(1, "motion-drill"), proof(8, "motion-drill")], 1)).toBe(1);
  });

  it("warns when motion drills are below target after midweek", () => {
    expect(shouldWarnMotionAvoidance([], 4, 2)).toBe(true);
    expect(shouldWarnMotionAvoidance([proof(1, "motion-drill"), proof(3, "motion-drill")], 4, 2)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/__tests__/progress.test.ts`

Expected: FAIL because `src/domain/progress.ts` does not exist.

- [ ] **Step 3: Implement progress rules**

```ts
import type { ProofEntry } from "./types";

export function getCompletedDays(proofs: ProofEntry[]): number {
  return new Set(proofs.map((proof) => proof.day)).size;
}

export function getStreak(proofs: ProofEntry[], currentDay: number): number {
  const doneDays = new Set(proofs.map((proof) => proof.day));
  let streak = 0;
  for (let day = currentDay; day >= 1; day -= 1) {
    if (!doneDays.has(day)) break;
    streak += 1;
  }
  return streak;
}

export function getWeekForDay(day: number): number {
  return Math.ceil(day / 7);
}

export function getWeekDayRange(week: number): { start: number; end: number } {
  return { start: (week - 1) * 7 + 1, end: Math.min(week * 7, 90) };
}

export function getMotionDrillsThisWeek(proofs: ProofEntry[], week: number): number {
  const { start, end } = getWeekDayRange(week);
  return proofs.filter((proof) => proof.proofType === "motion-drill" && proof.day >= start && proof.day <= end).length;
}

export function shouldWarnMotionAvoidance(proofs: ProofEntry[], currentDay: number, targetPerWeek: number): boolean {
  const week = getWeekForDay(currentDay);
  const dayOfWeek = ((currentDay - 1) % 7) + 1;
  if (dayOfWeek < 4) return false;
  return getMotionDrillsThisWeek(proofs, week) < targetPerWeek;
}

export function getEmergencyCountThisWeek(proofs: ProofEntry[], week: number): number {
  const { start, end } = getWeekDayRange(week);
  return proofs.filter((proof) => proof.level === "emergency" && proof.day >= start && proof.day <= end).length;
}
```

- [ ] **Step 4: Run progress tests**

Run: `npm test -- src/__tests__/progress.test.ts`

Expected: PASS.

---

### Task 4: Add Local Storage Store

**Files:**
- Create: `src/storage/challengeStore.ts`
- Create: `src/__tests__/storage.test.ts`

- [ ] **Step 1: Write storage tests**

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultState, loadChallengeState, saveChallengeState } from "../storage/challengeStore";

describe("challengeStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates default state with style kit and day 1", () => {
    const state = createDefaultState();
    expect(state.currentDay).toBe(1);
    expect(state.styleKit.palette).toEqual(["#ffdd00", "#00c2ff", "#ff4fa3", "#111111", "#f7f7f2"]);
  });

  it("saves and loads state", () => {
    const state = createDefaultState();
    saveChallengeState({ ...state, currentDay: 5 });
    expect(loadChallengeState().currentDay).toBe(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/__tests__/storage.test.ts`

Expected: FAIL because `src/storage/challengeStore.ts` does not exist.

- [ ] **Step 3: Implement store**

```ts
import type { ChallengeState } from "../domain/types";

const STORAGE_KEY = "challenge90.strictCoach.v1";

export function createDefaultState(): ChallengeState {
  return {
    startDate: new Date().toISOString().slice(0, 10),
    currentDay: 1,
    proofs: [],
    weeklyReviews: [],
    emergencyLimitPerWeek: 2,
    styleKit: {
      palette: ["#ffdd00", "#00c2ff", "#ff4fa3", "#111111", "#f7f7f2"],
      subtitleRule: "No more than 2 lines. Highlight only the key word.",
      layoutRule: "One main message per screen. Bright accents, clean layout.",
    },
  };
}

export function loadChallengeState(): ChallengeState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultState();
  try {
    return { ...createDefaultState(), ...JSON.parse(raw) };
  } catch {
    return createDefaultState();
  }
}

export function saveChallengeState(state: ChallengeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetChallengeState(): ChallengeState {
  const state = createDefaultState();
  saveChallengeState(state);
  return state;
}
```

- [ ] **Step 4: Run storage tests**

Run: `npm test -- src/__tests__/storage.test.ts`

Expected: PASS.

---

### Task 5: Build Today Command Center

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/TodayCommandCenter.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Replace app shell with stateful tabs and store**

```tsx
import { useEffect, useMemo, useState } from "react";
import { TodayCommandCenter } from "./components/TodayCommandCenter";
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
        {activeTab !== "Today" && <h2>{activeTab}</h2>}
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create Today Command Center component**

```tsx
import { AlertTriangle, CheckCircle2, Flame, Send } from "lucide-react";
import { useState } from "react";
import { getEmergencyCountThisWeek, getStreak, getWeekForDay, shouldWarnMotionAvoidance } from "../domain/progress";
import type { ChallengeState, DailyMission, ProofEntry, TaskLevel } from "../domain/types";

interface Props {
  mission: DailyMission;
  state: ChallengeState;
  onChange: (state: ChallengeState) => void;
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
  const motionWarning = shouldWarnMotionAvoidance(state.proofs, state.currentDay, 2);
  const selectedTask = mission[level];

  function submitProof() {
    if (!title.trim() || !notes.trim()) return;
    const proof: ProofEntry = {
      id: crypto.randomUUID(),
      day: mission.day,
      level,
      proofType: mission.requiresMotion ? "motion-drill" : level === "emergency" ? "lesson" : "draft",
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

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Day {mission.day} / Week {mission.week}</p>
          <h2>{mission.title}</h2>
          <p>{mission.focus}</p>
        </div>
        <div className="metric-row">
          <span><Flame size={16} /> Streak {streak}</span>
          <span><AlertTriangle size={16} /> Emergency {emergencyCount}/{state.emergencyLimitPerWeek}</span>
        </div>
      </header>

      {motionWarning && (
        <div className="warning">
          <AlertTriangle size={18} />
          Motion graphic is being avoided this week. Do one small export today.
        </div>
      )}

      <section className="panel">
        <h3>Today's Mission</h3>
        <div className="level-grid">
          {(["full", "minimum", "emergency"] as const).map((taskLevel) => (
            <button key={taskLevel} className={`level-card ${level === taskLevel ? "is-selected" : ""}`} onClick={() => setLevel(taskLevel)} type="button">
              <strong>{taskLevel.toUpperCase()}</strong>
              <span>{mission[taskLevel]}</span>
            </button>
          ))}
        </div>
        <p className="selected-task">{selectedTask}</p>
      </section>

      <section className="panel">
        <h3>Submit Proof</h3>
        {level !== "full" && (
          <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for downgrade" />
        )}
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Proof title" />
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Optional link" />
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={mission.proofPrompt} rows={4} />
        <button className="primary-action" onClick={submitProof} type="button">
          <Send size={16} /> Submit proof
        </button>
      </section>

      <section className="panel compact">
        <CheckCircle2 size={18} />
        No proof means today is not done.
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Add component styles**

```css
.page-stack {
  display: grid;
  gap: 18px;
}

.page-header {
  align-items: start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.page-header h2 {
  font-size: 34px;
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
}

.dark {
  color: #111111;
}

.metric-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.metric-row span,
.warning,
.panel {
  background: #ffffff;
  border: 2px solid #111111;
  border-radius: 8px;
}

.metric-row span,
.warning,
.compact {
  align-items: center;
  display: flex;
  gap: 8px;
}

.metric-row span {
  font-weight: 800;
  padding: 8px 10px;
}

.warning {
  background: #ffdd00;
  font-weight: 800;
  padding: 12px;
}

.panel {
  padding: 16px;
}

.panel h3 {
  margin: 0 0 12px;
}

.level-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.level-card {
  background: #f7f7f2;
  border: 2px solid #111111;
  border-radius: 8px;
  cursor: pointer;
  display: grid;
  gap: 8px;
  min-height: 140px;
  padding: 12px;
  text-align: left;
}

.level-card.is-selected {
  background: #00c2ff;
}

.selected-task {
  font-weight: 800;
  margin: 14px 0 0;
}

input,
textarea {
  border: 2px solid #111111;
  border-radius: 8px;
  box-sizing: border-box;
  display: block;
  margin-bottom: 10px;
  padding: 10px 12px;
  width: 100%;
}

.primary-action {
  align-items: center;
  background: #111111;
  border: 0;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-weight: 800;
  gap: 8px;
  padding: 11px 14px;
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`

Expected: PASS.

---

### Task 6: Add Plan, Motion, Proof, Review, And Settings Pages

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/PlanView.tsx`
- Create: `src/components/MotionTrack.tsx`
- Create: `src/components/ProofVault.tsx`
- Create: `src/components/WeeklyReview.tsx`
- Create: `src/components/Settings.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Create PlanView**

```tsx
import type { ChallengePlan } from "../domain/types";

export function PlanView({ plan }: { plan: ChallengePlan }) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">13-week arc</p>
          <h2>90-Day Plan</h2>
        </div>
      </header>
      <div className="week-grid">
        {plan.weeks.map((week) => (
          <section className="panel" key={week.week}>
            <h3>W{week.week}: {week.theme}</h3>
            <p>{week.outcome}</p>
            <ol>
              {week.days.map((day) => (
                <li key={day.day}>
                  Day {day.day}: {day.title} {day.requiresMotion ? "(motion)" : ""}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create MotionTrack**

```tsx
import { getMotionDrillsThisWeek, getWeekForDay } from "../domain/progress";
import type { ChallengeState } from "../domain/types";

const ladder = ["Text pop", "Shape + label", "Icon motion", "Step explainer", "Full motion clip"];

export function MotionTrack({ state }: { state: ChallengeState }) {
  const week = getWeekForDay(state.currentDay);
  const drills = getMotionDrillsThisWeek(state.proofs, week);
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Mandatory skill</p>
          <h2>Motion Track</h2>
          <p>{drills}/2 drills completed this week.</p>
        </div>
      </header>
      <div className="ladder-grid">
        {ladder.map((label, index) => (
          <section className="panel" key={label}>
            <h3>L{index + 1}</h3>
            <p>{label}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ProofVault**

```tsx
import type { ProofEntry } from "../domain/types";

export function ProofVault({ proofs }: { proofs: ProofEntry[] }) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Evidence</p>
          <h2>Proof Vault</h2>
        </div>
      </header>
      {proofs.length === 0 ? (
        <section className="panel">No proof yet. Today is not done until proof exists.</section>
      ) : (
        <div className="proof-list">
          {proofs.map((proof) => (
            <section className="panel" key={proof.id}>
              <h3>Day {proof.day}: {proof.title}</h3>
              <p>{proof.notes}</p>
              <p>{proof.level} / {proof.proofType}</p>
              {proof.url && <a href={proof.url}>{proof.url}</a>}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create WeeklyReview**

```tsx
import { useState } from "react";
import { getCompletedDays, getMotionDrillsThisWeek, getWeekForDay } from "../domain/progress";
import type { ChallengeState, WeeklyReviewEntry } from "../domain/types";

export function WeeklyReview({ state, onChange }: { state: ChallengeState; onChange: (state: ChallengeState) => void }) {
  const week = getWeekForDay(state.currentDay);
  const [bestSignal, setBestSignal] = useState("");
  const [avoided, setAvoided] = useState("");
  const [adjustment, setAdjustment] = useState("");

  function submitReview() {
    const review: WeeklyReviewEntry = {
      week,
      completedDays: getCompletedDays(state.proofs),
      postsPublished: state.proofs.filter((proof) => proof.proofType === "post").length,
      motionDrills: getMotionDrillsThisWeek(state.proofs, week),
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
          <h2>Weekly Review</h2>
        </div>
      </header>
      <section className="panel">
        <textarea value={bestSignal} onChange={(event) => setBestSignal(event.target.value)} placeholder="Best signal from audience or your own practice" rows={3} />
        <textarea value={avoided} onChange={(event) => setAvoided(event.target.value)} placeholder="What did you avoid?" rows={3} />
        <textarea value={adjustment} onChange={(event) => setAdjustment(event.target.value)} placeholder="One adjustment for next week" rows={3} />
        <button className="primary-action" onClick={submitReview} type="button">Lock weekly review</button>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Create Settings**

```tsx
import type { ChallengeState } from "../domain/types";
import { resetChallengeState } from "../storage/challengeStore";

export function Settings({ state, onChange }: { state: ChallengeState; onChange: (state: ChallengeState) => void }) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Personal system</p>
          <h2>Settings</h2>
        </div>
      </header>
      <section className="panel">
        <p>Start date: {state.startDate}</p>
        <p>Palette: {state.styleKit.palette.join(", ")}</p>
        <p>{state.styleKit.subtitleRule}</p>
        <p>{state.styleKit.layoutRule}</p>
        <button className="primary-action" onClick={() => onChange(resetChallengeState())} type="button">Reset challenge data</button>
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Wire pages in App**

Add imports:

```tsx
import { MotionTrack } from "./components/MotionTrack";
import { PlanView } from "./components/PlanView";
import { ProofVault } from "./components/ProofVault";
import { Settings } from "./components/Settings";
import { WeeklyReview } from "./components/WeeklyReview";
```

Replace workspace conditional rendering:

```tsx
{activeTab === "Today" && <TodayCommandCenter mission={todayMission} state={state} onChange={setState} />}
{activeTab === "90-Day Plan" && <PlanView plan={seedPlan} />}
{activeTab === "Motion Track" && <MotionTrack state={state} />}
{activeTab === "Proof Vault" && <ProofVault proofs={state.proofs} />}
{activeTab === "Review" && <WeeklyReview state={state} onChange={setState} />}
{activeTab === "Settings" && <Settings state={state} onChange={setState} />}
```

- [ ] **Step 7: Add grid styles**

```css
.week-grid,
.ladder-grid,
.proof-list {
  display: grid;
  gap: 14px;
}

.week-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.ladder-grid {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.panel ol {
  margin: 12px 0 0;
  padding-left: 22px;
}
```

- [ ] **Step 8: Verify build and tests**

Run: `npm test`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

---

### Task 7: PWA Mobile Polish And First-Run Verification

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add compact mobile controls and desktop expansion**

```css
.page-header {
  display: grid;
}

.level-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 860px) {
  .page-header {
    align-items: start;
    display: flex;
  }

  .level-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

- [ ] **Step 2: Start local dev server**

Run: `npm run dev`

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 3: Browser and Android-style PWA verification**

Open the Vite URL in the in-app browser and verify:

- Today page shows Day 1 Baseline Clip Test.
- Full, Minimum, and Emergency cards are selectable.
- Submitting proof adds a Proof Vault entry.
- Motion Track shows 0/2 or updated drill count.
- 90-Day Plan shows 13 weeks and 90 days.
- Mobile viewport does not overlap text or controls at 390px width.
- `manifest.webmanifest` loads from `/manifest.webmanifest`.
- `sw.js` registers in the browser without console errors.
- The app is usable as a standalone Android home-screen PWA after deployment or local HTTPS testing.

- [ ] **Step 4: Final verification**

Run: `npm test`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

---

## Self-Review

Spec coverage:

- Personal-only app: covered by client-only MVP and no account tasks.
- Today Command Center: Task 5.
- 90-Day Plan with W1 CapCut Sprint: Task 2 and Task 6.
- Motion Graphic Discipline Track: Task 3 and Task 6.
- Clip format rotation: Task 2 seed data and future plan expansion.
- Pop art minimalist style kit: Task 4 default state and Task 5/7 styling.
- Proof Vault: Task 4 and Task 6.
- Downgrade Day Engine: Task 5 level selection, reason field, and progress tracking.
- Weekly Review: Task 6.
- MVP-first scope: all tasks avoid backend, account system, public features, and advanced analytics.

Implementation risks:

- The first MVP stores data in localStorage only. This is acceptable for the first 7-day test, but later export/backup should be added.
- The fallback 90-day plan after Week 1 is structured but generic. After the MVP works, replace weeks 2-13 with richer day-specific missions.
- The AI coach is intentionally not implemented in MVP. Downgrade uses preset task levels first.
- The app starts as a PWA, not a native Android app. Push notifications should be added after the user confirms the daily workflow is worth keeping.
