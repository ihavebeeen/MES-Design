# MES UI repository entry point

Before creating, changing, or auditing UI in this repository:

1. Read `AGENTS.override.md` as the authoritative concise project policy.
2. Use the Claude project skill at `.claude/skills/generate-mes-ui/SKILL.md`.
3. That Claude entry point delegates to the shared rules in `.agents/skills/generate-mes-ui/SKILL.md` and its referenced repository contract.
4. Create and resolve a `ScreenRequest` before writing JSX.

Do not define independent MES design rules in this file. The shared policy and registry are the sources of truth.
