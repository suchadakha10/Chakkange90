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
  proofSync: {
    scriptUrl: string;
    secret: string;
    lastSyncedAt?: string;
  };
  styleKit: {
    palette: string[];
    subtitleRule: string;
    layoutRule: string;
  };
}
