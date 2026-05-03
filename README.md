# AI Study Planner

College-admission–friendly project: **scheduling + study science**, not just a chat wrapper.

## What it does

- Add tasks (subject, minutes, due weekday).
- Generates a **greedy weekday afternoon plan** (90-minute chunks, rolls across days).
- Shows a **static “coach” panel** with heuristics (spacing, overload, large-task splitting).

## Why it matters

Shows you can implement **constraints, sorting, and UX** without hiding behind an API. README documents how you’d add optional LLM re-ranking later.

## Run

```bash
npm install
npm run dev
```

Deploy over **HTTPS** so “Add to Home Screen” (PWA) works. Core scheduling logic is in **`src/lib/planner.ts`** (no DOM) for a future **React Native / Expo** app — see **`MOBILE.md`**.

## Next steps (good for essays)

- Export `.ics` for Google Calendar.
- Spaced-repetition tags per subject.
- Optional `VITE_OPENAI_BASE_URL` + key: rewrite coach tip with model (keep heuristics as fallback).

## License

MIT — by Arnav Rastogi / portfolio use.
