import { type GrimoireSession } from "./types";

const STORAGE_KEY = "botc-grimoire-v1";
const BACKUP_STORAGE_KEY = "botc-grimoire-v1-backup";
const CURRENT_VERSION = 1;

export function loadGrimoire(): GrimoireSession | null {
  if (typeof window === "undefined") return null;

  try {
    return readSession(localStorage.getItem(STORAGE_KEY)) ?? readSession(localStorage.getItem(BACKUP_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveGrimoire(state: GrimoireSession): void {
  if (typeof window === "undefined") return;

  try {
    const updated = { ...state, updatedAt: new Date().toISOString() };

    const payload = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, payload);
    localStorage.setItem(BACKUP_STORAGE_KEY, payload);
  } catch (e) {
    console.error("Failed to save grimoire:", e);
  }
}

export function clearGrimoire(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_STORAGE_KEY);
}

function readSession(raw: string | null): GrimoireSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GrimoireSession;

    if (typeof parsed?.version !== "number") return null;

    if (parsed.version < CURRENT_VERSION) {
      return migrate(parsed);
    }

    return parsed;
  } catch {
    return null;
  }
}

function migrate(old: GrimoireSession): GrimoireSession {
  // Migration from v1 to v1+ (add compositionMode if missing)
  const setup = old.setup as GrimoireSession["setup"] & {
    compositionMode?: "random" | "custom";
  };
  if (!("compositionMode" in setup)) {
    return {
      ...old,
      version: CURRENT_VERSION,
      setup: {
        ...(setup as GrimoireSession["setup"]),
        compositionMode: "random", // Default to random for old sessions
      },
    } as GrimoireSession;
  }

  return { ...old, version: CURRENT_VERSION };
}
