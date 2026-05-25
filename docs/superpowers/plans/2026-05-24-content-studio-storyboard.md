# Content Studio Storyboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free template-based Content Studio that proposes three content directions and creates a storyboard after selection.

**Architecture:** Put deterministic generator logic in `src/domain/contentStudio.ts`, render the workflow in `src/components/ContentStudio.tsx`, and connect it from `src/App.tsx`. Add focused tests for generator behavior and the UI flow.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.

---

## Tasks

- [ ] Add failing domain tests for three options and six-frame storyboard.
- [ ] Implement `src/domain/contentStudio.ts`.
- [ ] Add failing component test for topic input, option selection, and storyboard rendering.
- [ ] Implement `ContentStudio` and connect a new tab.
- [ ] Add responsive styling.
- [ ] Run tests and build.
- [ ] Verify in browser.
