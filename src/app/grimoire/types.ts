export type Edition = "trouble-brewing" | "bad-moon-rising" | "sects-and-violets" | "experimental";
export type PlayerState = "alive" | "dead" | "executed";
export type TokenKind = "poisoned" | "drunk" | "protected" | "night-kill" | "custom";
export type ScriptSlot = "townsfolk" | "outsider" | "minion" | "demon" | "traveller" | "fabled";
export type GamePhase = "setup" | "night" | "day" | "end";

export interface GrimoireSession {
  version: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  edition: Edition;
  setup: SetupState;
  players: PlayerEntry[];
  journal: JournalEntry[];
  ui: {
    currentPhase: GamePhase;
    showSecrets: boolean;
    dayNumber: number;
    nightNumber: number;
  };
}

export interface SetupState {
  playerCount: number;
  script: ScriptComposition;
  selectedCharacterIds: string[];
  modifiers: ScriptModifier[];
  compositionMode: "random" | "custom";
}

export interface ScriptComposition {
  totals: Record<ScriptSlot, number>;
}

export interface CompositionValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ScriptModifier {
  id: string;
  label: string;
  description: string;
  delta: Partial<Record<ScriptSlot, number>>;
}

export interface PlayerEntry {
  id: string;
  name: string;
  seat: number;
  characterId: string;
  state: PlayerState;
  tokens: TokenKind[];
  notes: string;
}

export interface JournalEntry {
  id: string;
  at: string;
  phase: "night" | "day";
  message: string;
  meta?: Record<string, unknown>;
}
