import { type GrimoireSession } from "./types";

const STORAGE_KEY = "botc-grimoire-v1";
const CURRENT_VERSION = 1;

export function loadGrimoire(): GrimoireSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as GrimoireSession;

    if (parsed.version < CURRENT_VERSION) {
      return migrate(parsed);
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveGrimoire(state: GrimoireSession): void {
  if (typeof window === "undefined") return;

  try {
    const updated = { ...state, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save grimoire:", e);
  }
}

export function clearGrimoire(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

function migrate(old: GrimoireSession): GrimoireSession {
  // Migration from v1 to v1+ (add compositionMode if missing)
  const setup = old.setup as any;
  if (!("compositionMode" in setup)) {
    return {
      ...old,
      version: CURRENT_VERSION,
      setup: {
        ...setup,
        compositionMode: "random", // Default to random for old sessions
      },
    } as GrimoireSession;
  }

  return { ...old, version: CURRENT_VERSION };
}
