# MES UI repository instructions

Use `AGENTS.override.md` as the authoritative concise project policy and `.agents/skills/generate-mes-ui/SKILL.md` as the screen workflow. For every MES page or popup request, create a schema-valid `ScreenRequest`, run `npm run screen:resolve`, and implement only the resolved registered components and patterns. Do not invent a parallel policy in this file.
