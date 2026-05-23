# 90-Day Strict Coach Design

## Purpose

Build a personal web app that forces daily execution for a 90-day challenge. The app is for one user only. Its job is to make the user practice, produce content, submit proof, and review progress every day.

The main challenge theme is "เทคข้างร้าน": practical tech content for small shops, sellers, and future print-shop customers. The system should help the user become better at content production, CapCut editing, motion graphic basics, and clear teaching through short-form videos.

## Core Principles

- No proof means the day is not done.
- Every day must produce something, even on bad days.
- The user practices every day and posts 4-5 days per week.
- Motion graphic practice is mandatory because it is a weak but desired skill.
- Planning is weekly, execution is daily, review is every 7 days.
- Downgrading work is allowed for real constraints, but quitting for the day is not.

## Audience And Content Positioning

The target audience is small shop owners, sellers, and people who need to make content or prepare files for selling and printing.

Content should connect practical tech with small-business usefulness:

- CapCut and short-form video editing
- Canva and design basics for selling
- AI tools for captions, scripts, and shop work
- Print-file preparation and common file mistakes
- Practical workflow for small shops
- The user's journey building skill and preparing for a future print shop

## App Structure

### 1. Today Command Center

The default landing page. It shows the current day, current week, today's mission, required proof, and the user's current accountability state.

It includes:

- Day number and week theme
- Today's Full, Minimum, and Emergency versions
- Proof submission form
- Streak and emergency-day status
- Motion drill warning if motion practice is being avoided
- Tomorrow's smallest next action

### 2. 90-Day Plan

A 13-week plan with weekly themes and daily tasks. The plan should be editable, but weekly plans should be treated as locked unless changed for a clear reason.

The first week is CapCut Production Sprint because the user is away from the shop and wants to sharpen editing skills before returning.

Week 1 goals:

- Improve editing speed
- Improve retention through hook, pacing, and subtitles
- Build a reusable pop-art minimalist style kit
- Produce 2 real clips
- Complete 2 motion graphic drills
- Put at least 1 motion element into a real clip

### 3. Motion Graphic Discipline Track

Motion graphic is a mandatory skill track, not an optional content format. It should be strict because the user is new to it and likely to avoid it when tired.

Skill ladder:

- L1: Text pop in/out
- L2: Shape and label highlights
- L3: Icon motion such as arrows, circles, and checkmarks
- L4: Step explainer with 3 clear steps
- L5: Full motion clip, 20-30 seconds

Rules:

- At least 2 motion drills per week
- Proof must be an exported draft or usable clip segment
- Watching a tutorial does not count without a self-made output
- Drills should be small enough to finish but real enough to reuse

### 4. Clip Format Rotation

The channel should use multiple formats while keeping one visual identity.

Weekly rotation should include:

- 1 motion graphic
- 1 screen/tutorial or footage-based clip
- 1 talking head or talking-head mix
- 1 saveable checklist or practical tip

Supported formats:

- Motion graphic explainer
- Footage plus screen recording
- Talking head with subtitles and cutaways

### 5. Style Kit

The visual direction is pop art color minimalist.

Rules:

- Use bright color accents, but keep layout clean.
- Prefer a small fixed palette: yellow, cyan, pink, black, and off-white.
- One screen should communicate one main message.
- Text must be readable on mobile.
- Subtitles should use no more than 2 lines at a time.
- Create reusable templates for hook, step cards, before/after, checklist, and outro.

### 6. Proof Vault

The app stores proof for each day so progress can be reviewed.

Proof types:

- Posted video link
- Draft clip or export note
- Motion graphic drill
- Script
- Hooks
- Canva or visual mockup
- Lesson learned
- Screenshot or written proof for emergency days

Each proof entry should be tied to a challenge day and a task level: Full, Minimum, or Emergency.

### 7. Downgrade Day Engine

When the user has urgent obligations, the app lets the user reduce task size without breaking the chain.

Flow:

1. User selects Downgrade Day.
2. User picks or writes a reason.
3. App converts the Full mission into Minimum or Emergency.
4. User still submits proof.
5. Weekly Review records downgrade patterns.

Example:

- Full: Make a 30-second motion graphic clip and export it.
- Minimum: Make a 5-10 second motion segment or 3 hook openings.
- Emergency: Make one text-pop animation or storyboard 3 frames.

Downgrades should be tracked. If motion graphic work is repeatedly downgraded, the app should warn that the user may be avoiding the exact skill they want to build.

### 8. Weekly Review

Every 7 days, the user must review evidence before changing strategy.

Review fields:

- Days completed
- Posts published
- Motion drills completed
- Proof submitted
- Best-performing topic
- Comments, saves, shares, DMs, or follows
- What the user avoided
- Biggest distraction
- One adjustment for next week

The weekly review should lock the next week's plan.

## MVP Scope

Build the first usable version with:

- Today Command Center
- 90-Day Plan with Week 1 CapCut Production Sprint
- Proof Vault
- Motion Track
- Downgrade Day Engine
- Weekly Review
- Mobile-first PWA shell for Android Add to Home Screen use

Do not start with advanced analytics, public/community features, full automation, or a complex AI coach. Those can come later after the first 7-day test.

## Phase Two Ideas

After the MVP is useful for the first week:

- Morning and evening reminders
- PWA push notifications after the first usable version proves useful
- AI coach for task reframing
- Content performance analytics
- Skill score trends
- Auto-generated next-week plan suggestions
- Exportable proof report

## Success Criteria

The MVP succeeds if, during the first 7 days:

- The user submits proof every day.
- The user posts at least 2 clips.
- The user completes at least 2 motion drills.
- The user creates or improves a reusable CapCut style template.
- The user completes a weekly review and locks Week 2.

## Open Implementation Notes

- The app is personal-only, so account and multi-user features are out of scope.
- The app should be mobile-first because daily check-ins and proof submission will usually happen on Android.
- The app should optimize for speed of daily check-in, not heavy project management.
- The first version can use local storage or a simple local database, depending on the chosen stack.
- Native Android is out of scope for the first version. Start with a PWA so the user can add it to the Android home screen.
- Push notifications are phase two. The MVP should include the service worker and manifest foundation, but not rely on push notifications for accountability.
- The system should make the easiest correct action obvious: check today's task, do the smallest valid version, submit proof.
