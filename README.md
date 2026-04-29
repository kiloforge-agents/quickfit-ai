# QuickFitAI

> A weekly workout that fits your life, rewritten when your body says so.

QuickFitAI is a free, no-subscription, no-login fitness planner. Tell it your goal, equipment, and how much time you actually have, and it prints a 7-day plan instantly. A wearable feed (live demo signal included) adapts the week in real time when recovery dips.

## Features

- 5-input planner — goal, experience, time budget, equipment, injuries.
- On-device generation — no API calls, no data sent anywhere.
- Wearable adaptation — HRV, resting HR, sleep, recovery score; hard days auto-swap to mobility when recovery is low.
- Print-optimised plan page — Cmd/Ctrl + P produces a clean weekly sheet.
- Editorial design — paper-grain hero, serif display type, hand-marked underlines.

## Stack

- Next.js (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Static generation, no backend

## Local dev

```bash
npm install
npm run dev
```

## Routes

- `/` — landing + plan builder
- `/plan?d=…` — generated weekly plan with live wearable strip

## License

MIT
