import { type Edition, type ScriptComposition, type ScriptModifier, type ScriptSlot, type PlayerEntry, type TokenKind, type PlayerState } from "./types";
import { charactersByEdition, type Character } from "@/data/characters";

// Standard BotC composition table (5–15 players)
const BASE_COMPOSITION: Record<number, Record<ScriptSlot, number>> = {
  5:  { townsfolk: 3, outsider: 0, minion: 1, demon: 1, traveller: 0, fabled: 0 },
  6:  { townsfolk: 3, outsider: 1, minion: 1, demon: 1, traveller: 0, fabled: 0 },
  7:  { townsfolk: 5, outsider: 0, minion: 1, demon: 1, traveller: 0, fabled: 0 },
  8:  { townsfolk: 5, outsider: 1, minion: 1, demon: 1, traveller: 0, fabled: 0 },
  9:  { townsfolk: 5, outsider: 2, minion: 1, demon: 1, traveller: 0, fabled: 0 },
  10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1, traveller: 0, fabled: 0 },
  11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1, traveller: 0, fabled: 0 },
  12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1, traveller: 0, fabled: 0 },
  13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1, traveller: 0, fabled: 0 },
  14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1, traveller: 0, fabled: 0 },
  15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1, traveller: 0, fabled: 0 },
};

export function getBaseComposition(playerCount: number): Record<ScriptSlot, number> {
  const clamped = Math.max(5, Math.min(15, playerCount));
  return { ...BASE_COMPOSITION[clamped] };
}

export function buildScriptComposition(
  playerCount: number,
  modifiers: ScriptModifier[]
): ScriptComposition {
  const totals = getBaseComposition(playerCount);

  for (const mod of modifiers) {
    for (const [slot, delta] of Object.entries(mod.delta)) {
      const key = slot as ScriptSlot;
      totals[key] = Math.max(0, totals[key] + (delta as number));
    }
  }

  // Rebalance: ensure total matches playerCount
  const currentTotal = totals.townsfolk + totals.outsider + totals.minion + totals.demon;
  const diff = playerCount - currentTotal;
  if (diff > 0) {
    totals.townsfolk += diff;
  } else if (diff < 0) {
    totals.townsfolk = Math.max(0, totals.townsfolk + diff);
  }

  return { totals };
}

export function getAvailableModifiers(edition: Edition): ScriptModifier[] {
  const chars = charactersByEdition[edition];
  const mods: ScriptModifier[] = [];

  if (chars.some((c) => c.id === "baron")) {
    mods.push({
      id: "baron",
      label: "Baron",
      description: "+2 Outsiders, -2 Townsfolk",
      delta: { outsider: 2, townsfolk: -2 },
    });
  }

  if (chars.some((c) => c.id === "godfather")) {
    mods.push({
      id: "godfather",
      label: "Godfather",
      description: "+1 or -1 Outsider",
      delta: { outsider: -1 },
    });
  }

  if (chars.some((c) => c.id === "fang-gu")) {
    mods.push({
      id: "fang-gu",
      label: "Fang Gu",
      description: "+1 Outsider",
      delta: { outsider: 1, townsfolk: -1 },
    });
  }

  if (chars.some((c) => c.id === "vigormortis")) {
    mods.push({
      id: "vigormortis",
      label: "Vigormortis",
      description: "-1 Outsider",
      delta: { outsider: -1, townsfolk: 1 },
    });
  }

  return mods;
}

// Fisher-Yates shuffle
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getUnusedRoles(edition: Edition, selectedCharacterIds: string[]): Character[] {
  const selected = new Set(selectedCharacterIds);

  return charactersByEdition[edition]
    .filter((character) => !selected.has(character.id))
    .sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
}

export function pickImpBluffs(edition: Edition, selectedCharacterIds: string[], count = 3): Character[] {
  return shuffle(getUnusedRoles(edition, selectedCharacterIds)).slice(0, count);
}

/**
 * Validate a script composition against BotC rules
 * Rules from wiki.bloodontheclocktower.com:
 * - Must have exactly 1 Demon
 * - For 5-6 players: 1 Minion
 * - For 7-9 players: 1 Minion
 * - For 10+ players: 2+ Minions (usually 2-3)
 * - Outsiders depend on script modifiers (Baron adds 2)
 * - Total must equal playerCount
 */
export function getCompositionFromSelection(
  selectedCharacterIds: string[],
  edition: Edition
): ScriptComposition {
  const chars = charactersByEdition[edition];
  const totals = {
    townsfolk: 0,
    outsider: 0,
    minion: 0,
    demon: 0,
    traveller: 0,
    fabled: 0,
  };

  selectedCharacterIds.forEach((id) => {
    const char = chars.find((c) => c.id === id);
    if (char) {
      totals[char.type] = (totals[char.type] ?? 0) + 1;
    }
  });

  return { totals };
}

export function validateComposition(
  composition: ScriptComposition,
  playerCount: number,
  modifiers: ScriptModifier[],
  t: (fr: string, en: string) => string,
  expected?: ScriptComposition
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { totals } = composition;

  // Rule 1: Exactly 1 Demon
  if (totals.demon !== 1) {
    errors.push(
      t(
        `Doit y avoir exactement 1 Démon (actuellement ${totals.demon})`,
        `Must have exactly 1 Demon (got ${totals.demon})`
      )
    );
  }

  // Rule 2: Must have at least 1 Minion for standard play
  if (totals.minion < 1 && playerCount >= 5) {
    errors.push(
      t(
        `Doit y avoir au moins 1 Sbire pour ${playerCount} joueurs`,
        `Must have at least 1 Minion for ${playerCount} players`
      )
    );
  }

  // Rule 3: Minion count based on player count
  if (playerCount >= 10 && totals.minion < 2) {
    warnings.push(
      t(
        `Habituellement 2+ Sbires pour ${playerCount} joueurs (vous en avez ${totals.minion})`,
        `Usually 2+ Minions for ${playerCount} players (you have ${totals.minion})`
      )
    );
  }

  // Rule 4: Total must equal playerCount
  const total = totals.townsfolk + totals.outsider + totals.minion + totals.demon + totals.traveller + totals.fabled;
  if (total !== playerCount) {
    errors.push(
      t(
        `Total des rôles (${total}) doit égaler le nombre de joueurs (${playerCount})`,
        `Total characters (${total}) must equal player count (${playerCount})`
      )
    );
  }

  // Rule 5: Reasonable Outsider count
  if (totals.outsider > playerCount / 3) {
    warnings.push(
      t(
        `Le nombre d'Étrangers (${totals.outsider}) est élevé pour ${playerCount} joueurs`,
        `Outsider count (${totals.outsider}) seems high for ${playerCount} players`
      )
    );
  }

  // Rule 6: Match expected composition (used in custom select mode)
  if (expected) {
    for (const slot of Object.keys(expected.totals) as ScriptSlot[]) {
      const expectedCount = expected.totals[slot];
      const actualCount = totals[slot];
      if (actualCount !== expectedCount) {
        errors.push(
          t(
            `La composition attendue pour ${slot} est ${expectedCount} (actuel ${actualCount})`,
            `Expected ${expectedCount} ${slot} (got ${actualCount})`
          )
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculate how many slots of each type are available for a given player count
 * considering existing characters in the composition
 */
export function getRemainingSlots(
  composition: ScriptComposition,
  playerCount: number
): Record<ScriptSlot, number> {
  const { totals } = composition;
  const total = totals.townsfolk + totals.outsider + totals.minion + totals.demon + totals.traveller + totals.fabled;
  const remaining = playerCount - total;

  if (remaining === 0) {
    return { townsfolk: 0, outsider: 0, minion: 0, demon: 0, traveller: 0, fabled: 0 };
  }

  // Suggest distribution for remaining slots (basic algorithm)
  // Prioritize townsfolk, then balance based on need
  const suggested: Record<ScriptSlot, number> = {
    townsfolk: 0,
    outsider: 0,
    minion: 0,
    demon: 0,
    traveller: 0,
    fabled: 0,
  };

  // Available slots for recommendations (before final composition)
  suggested.townsfolk = remaining; // Default: fill remaining with townsfolk

  return suggested;
}

export function pickCharactersForScript(
  edition: Edition,
  composition: ScriptComposition
): Character[] {
  const chars = charactersByEdition[edition];
  const byType = (type: ScriptSlot) => chars.filter((c) => c.type === type);

  const picked: Character[] = [];
  const slots: ScriptSlot[] = ["townsfolk", "outsider", "minion", "demon"];

  for (const slot of slots) {
    const available = shuffle(byType(slot));
    const count = composition.totals[slot];
    picked.push(...available.slice(0, count));
  }

  return picked;
}

export function randomizePlayers(
  characters: Character[],
  playerCount: number
): PlayerEntry[] {
  const shuffled = shuffle(characters).slice(0, playerCount);
  return shuffled.map((char, i) => ({
    id: generateId(),
    name: `Player ${i + 1}`,
    seat: i + 1,
    characterId: char.id,
    state: "alive" as PlayerState,
    tokens: [],
    notes: "",
  }));
}

export function toggleToken(player: PlayerEntry, token: TokenKind): PlayerEntry {
  const has = player.tokens.includes(token);
  return {
    ...player,
    tokens: has ? player.tokens.filter((t) => t !== token) : [...player.tokens, token],
  };
}

export function setPlayerState(player: PlayerEntry, state: PlayerState): PlayerEntry {
  return { ...player, state };
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createJournalEntry(
  message: string,
  phase: "night" | "day",
  meta?: Record<string, unknown>
) {
  return {
    id: generateId(),
    at: new Date().toISOString(),
    phase,
    message,
    meta,
  };
}
