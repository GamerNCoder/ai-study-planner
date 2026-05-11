# Web → native mobile

This app is a **Vite + React** PWA-friendly SPA. Core scheduling lives in **`src/lib/planner.ts`** (no DOM) so you can import the same functions from **Expo (React Native)** later.

## Suggested Expo path

1. `npx create-expo-app study-planner-mobile --template blank-typescript`
2. Copy `planner.ts` into `src/domain/planner.ts` (or publish a tiny private package shared with this repo).
3. Replace HTML inputs with React Native `TextInput` / `Pressable`; persist tasks with `@react-native-async-storage/async-storage` or SQLite.
4. Point a small `api/` layer at the same JSON shape if you add a backend later.

## PWA

**vite-plugin-pwa** registers a service worker in dev (`devOptions.enabled`) and production: precached JS/CSS/HTML plus `manifest.webmanifest`, with **auto-update** when you ship a new build. Install: Chrome / Safari “Add to Home Screen” on HTTPS. Offline: app shell loads from cache; fresh data still needs network where applicable.
