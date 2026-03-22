# GitHub Copilot Workspace Instructions for botc

## Project context
- Framework: Next.js (App Router) + TypeScript + TailwindCSS
- Native mobile integration with Capacitor & Android
- Data-focused UI for Blood on the Clocktower game lore; static content in `src/data`, pages under `src/app`
- Python scripts in `/scripts` for asset fetching

## Local dev commands
- `npm install`
- `npm run dev` (web)
- `npm run build` + `npm run start`
- `npm run lint`
- `npm run assets:fetch`
- `npm run build:android:debug` (Android debug build via Capacitor)

## Key directories
- `src/app`: top-level routes and pages
- `src/app/grimoire`: core feature + local storage state
- `src/components`: reusable React components
- `public/assets/botc`: game artwork & manifest data
- `scripts`: data/asset crawlers and build helpers

## Coding conventions
- Prefer React Server Components for page files under `src/app`; `Client` components are used where hooks/state/DOM APIs are required (`use client` suffix in files). Match existing pattern in `grimoire` and `storyteller` pages.
- Keep logic in transparent functional components; avoid large inline render logic when helpers can go in `utils.ts` or `data` modules.
- TypeScript strictness: use interface/type alias in `src/app/grimoire/types.ts` and import from there.
- UI styling: Tailwind v4 via `app/globals.css`; utility class patterns appear in components like `CharacterCard.tsx` and `Navigation.tsx`.

## PR assistance guidance
1. Ask and confirm intended page/route for UI changes (e.g., `app/grimoire/page.tsx`).
2. Keep changes minimal and composable: separate data updates, UI tweaks, and behavior changes.
3. Add/adjust tests as required: project has no formal test folder currently, so prefer manual local checks with `npm run dev` and view pages.

## Special notes
- This repository uses Next.js 16 and React 19. Avoid assumptions from older Next.js versions (e.g., `getStaticProps` in App Router routes is not used).
- Native asset pipeline may rely on `public/assets/botc/manifest.json`; when adding assets, maintain `license` and `attribution` metadata.
- `src/app/grimoire` includes existing pwa-like local state and `storage.ts` utility; follow this pattern for persistent data.

## Link, don't embed
Where feasible, refer to existing docs in `README.md` and `packages.json` rather than duplicating command lists or architecture details.

## Suggested Copilot prompts
- "Implement a new Next.js route `app/strategy/page.tsx` that lists strategy briefs from `src/data/content.ts` using existing card styles."
- "Refactor `src/app/grimoire/components/PlayerCard.tsx` to remove duplicate state and use `useMemo` safely for derived values."
- "Add a new field to the player metadata model and update local storage handling in `src/app/grimoire/utils.ts`."

## Next agent-customizations to add
- `create-agent-customization for React + Next.js UI refactors` (auto-suggest component breakdown and style consistency checks).
- `create-agent-customization for mobile Capacitor flow` (build and sync tasks, debug logs, Android manifest updates).
