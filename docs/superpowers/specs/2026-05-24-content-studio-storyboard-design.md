# Content Studio Storyboard Design

## Goal

Add a free, template-based Content Studio to the 90-day app. The user enters a topic, the app proposes three content directions, the user selects one, and the app returns a storyboard pack.

## Scope

First version is rule-based and has no paid API dependency.

The feature must:

- Add a `Content Studio` tab.
- Accept a topic, audience, platform, length, and tone.
- Generate three content options from broad templates:
  - How-to / practical tutorial.
  - Problem-solution / mistake fix.
  - Story / case study.
- Let the user select one option.
- Generate a six-frame storyboard with:
  - Time range.
  - Beat.
  - Visual direction.
  - Text overlay.
  - Motion direction.
  - Voiceover.
  - Image prompt.
- Include production notes for CapCut/Canva style editing.

## Design

Create a small domain module for deterministic generation and a `ContentStudio` component for the UI. Keep generation pure and testable. Store no data in local storage for v1.

## Acceptance

- Empty topic disables generation.
- A valid topic produces exactly three options.
- Selecting an option reveals a storyboard with six frames.
- The page fits the existing dark, utilitarian dashboard style.
