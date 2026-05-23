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
    emergency: requiresMotion ? "Storyboard 3 motion frames or animate one text pop." : "Write one hook or one lesson learned.",
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
