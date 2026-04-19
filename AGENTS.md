# Stashy UI - AI Agent System Rules

You are acting as an autonomous developer within the Stashy UI web sandbox environment.
This codebase acts as a "Figma in code" environment strictly constrained to a mobile `max-w-sm`/`max-w-md` boundary.

## ⚠️ MANDATORY INITIALIZATION SEQUENCE

Whenever you begin a new chat or a new task in this repository, you MUST follow this sequence before generating any code:

1. **READ `spec/index.md`**: This is the mission entry point. It explains what Stashy is and explains the directory map.
2. **READ `spec/DESIGN.md`**: Do not arbitrarily generate CSS or Tailwind variables. All colors, spacings, and typography must be pulled directly from this file.
3. **READ `spec/skills.md`**: Use this guide to understand which coding strategies and design-engineering philosophies to heavily lean into.
4. **READ THE LATEST SESSION**: Look into `spec/sessions/` and read the most recently dated session file to understand the active blockers and current goals.

## ⚠️ RTL & BILINGUAL ENFORCEMENT

Stashy is actively bilingual (English/Arabic). Shadcn/UI is officially configured with native RTL support.

1. **NEVER** use physical directional CSS classes (`left-*`, `right-*`, `ml-*`, `pr-*`, etc.).
2. **ALWAYS** use logical CSS classes (`start-*`, `end-*`, `ms-*`, `pe-*`, etc.).
3. When using portaled shadcn UI elements (`PopoverContent`, `TooltipContent`), explicitly pass the `dir` prop to the portal to bypass known `tw-animate-css` logical orientation calculation bugs.

## ⚠️ MANDATORY WRAP-UP SEQUENCE

When you finish a task, or when the session is ending, you MUST:

1. **UPDATE THE SESSION LOG**: Update the active session entry in the _current day's session file_ in `spec/sessions/`. A session is a contiguous work block, not a single code edit or request. Only append a new `# Session [N]` entry after a meaningful time gap or restart of work (for example, stopping in the morning and continuing 6 hours later). If no file exists for today, create one by copying the exact LLM Context & Session templates from the previous day's log.

Remember: Your task is not just to write code, but to keep the documentation chronological, uniform, and instantly accessible to the next AI agent that replaces you.
