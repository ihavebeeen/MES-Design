---
name: generate-mes-ui
description: Create, change, reproduce, or audit MES pages, center modals, side panels, confirmation dialogs, and table workflows in this repository. Use when the user asks Claude Code to make or revise a MES UI screen from a natural-language request, an existing screen, or Figma evidence.
---

# Generate MES UI

Use the MES design system already contained in this repository. Do not invent a separate visual system or translate the request directly into free-form JSX.

## Required workflow

1. Read the repository-root `AGENTS.override.md`.
2. Read the canonical shared skill at `.agents/skills/generate-mes-ui/SKILL.md` completely.
3. Read every reference that the canonical skill requires for the current request, resolving its relative links from `.agents/skills/generate-mes-ui/`.
4. Follow that skill's ScreenRequest, resolution, implementation, audit, and verification workflow.

The `.agents` skill and the design-system registry are the sources of truth. This file is only the Claude Code discovery entry point; do not duplicate or redefine MES rules here.

## Runtime handling

- Use the `mes-ui` MCP tools when they are connected.
- Otherwise use the repository's npm commands described by the canonical skill.
- If Node.js or required packages are unavailable, explain exactly which generation or preview step cannot run. Do not bypass contract resolution with guessed JSX, and do not claim that a browser preview or verification succeeded.
- Do not require Git for the generation itself. A ZIP copy of the repository is sufficient, but Git-based updating is unavailable in that copy.

## User interaction

Interpret an ordinary Korean screen request and proceed without asking the user to provide technical terms already inferable from the repository. Ask only when a missing business choice would materially change the resulting screen.

At handoff, clearly separate what was generated, what was actually run or visually checked, and what remains blocked by the local environment.
