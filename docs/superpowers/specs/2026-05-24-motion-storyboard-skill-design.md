# Motion Storyboard Skill Design

## Goal

Create a Codex skill that helps turn short-form video ideas into motion graphic storyboard deliverables. The skill must produce visual storyboard output, not only written shot descriptions.

The default use case is fast content creation for TikTok, Reels, Shorts, and similar vertical-video formats.

## Recommended Direction

Use the **Hybrid Creator Pack** approach as the default workflow.

The skill should produce:

- A storyboard image sheet with 6-9 frames.
- Frame-by-frame shot notes.
- Image-generation prompts for each frame.
- Motion prompts for animation, transitions, camera movement, and pacing.
- Thai voiceover script with rough timing.
- Caption and hashtag draft.
- Production notes for assets, text overlays, sound effects, and editing.

## Trigger Examples

The skill should activate when the user asks for:

- A motion graphic storyboard.
- A storyboard with actual images.
- A visual plan for TikTok, Reels, Shorts, or vertical video.
- A content idea turned into frames, motion, and production prompts.
- A storyboard package for Canva, CapCut, Runway, Kling, Pika, After Effects, or similar tools.

Example prompts:

- "Create a motion graphic storyboard for this clip, with images."
- "Make a 9:16 TikTok storyboard about small shops using AI."
- "Turn this idea into a storyboard with image prompts and motion prompts."
- "Create a CapCut-ready creator pack from this topic."

## User Inputs

The skill should collect only the missing essentials:

- Topic or rough idea.
- Target audience.
- Platform and aspect ratio, defaulting to TikTok/Reels 9:16.
- Desired length, defaulting to 15-30 seconds.
- Tone or style, defaulting to practical, clear, and creator-friendly.
- Brand or channel context if available.
- Any required CTA.

If the user gives a weak brief, the skill should make reasonable assumptions and label them.

## Workflow

1. Clarify the brief only when needed.
2. Draft a short content structure: hook, beats, reveal, proof, CTA.
3. Convert the structure into 6-9 storyboard frames.
4. Define visual style, composition, camera behavior, text overlay, and motion for each frame.
5. Generate the storyboard image sheet using the available image-generation workflow.
6. Provide production text alongside the image:
   - Shot list.
   - Per-frame image prompts.
   - Per-frame motion prompts.
   - Voiceover with timing.
   - Caption and hashtags.
7. Offer one focused revision pass, such as making the pacing faster, mood more premium, visuals simpler, or CTA stronger.

## Visual Output Requirements

The storyboard image is required.

Default image format:

- One-page storyboard sheet.
- 6-9 vertical 9:16 panels.
- Each panel numbered.
- Each panel includes a concise frame label.
- Visuals should be clear enough to guide editing, not merely decorative.

Optional output when useful:

- Individual 9:16 frame images.
- A simplified wireframe storyboard if the user wants speed over polish.
- A more polished concept-art storyboard if the user wants presentation quality.

## Skill Resources

Recommended skill name:

`motion-storyboard`

Recommended resources:

- `SKILL.md`: core workflow and triggering instructions.
- `references/storyboard-frame-schema.md`: frame fields and output format.
- `references/style-presets.md`: reusable motion graphic style presets.
- `references/prompt-patterns.md`: image and motion prompt templates.

No script is required for the first version because image generation should use the active image-generation capability. Add scripts later only if layout assembly or export becomes repetitive.

## Output Contract

Every completed run should include:

1. Brief assumptions.
2. Story structure.
3. Storyboard image.
4. Frame table.
5. Image prompts.
6. Motion prompts.
7. Voiceover.
8. Caption.
9. Revision options.

## Implementation Defaults

Use these defaults for the first version:

- Create the skill in `C:/Users/sucha/.codex/skills` so Codex can discover it automatically.
- Use Thai as the default language for user-facing outputs.
- Always generate the storyboard image for standard 6-9 frame storyboards.
- Ask before generating images only when the user requests more than 9 frames or multiple visual variants.
