"use client";

import { useLang } from "@/context/LangContext";
import { type GrimoireSession, type PlayerEntry, type TokenKind, type PlayerState } from "../types";
import { allCharacters, editionMeta } from "@/data/characters";
import PlayerTable from "./PlayerTable";
import PhaseControls from "./PhaseControls";
import JournalPanel from "./JournalPanel";

interface Props {
  session: GrimoireSession;
  onUpdateSession: (updater: (prev: GrimoireSession) => GrimoireSession) => void;
  onReset: () => void;
}

export default function GrimoireBoard({ session, onUpdateSession, onReset }: Props) {
  const { t } = useLang();
  const meta = editionMeta[session.edition];

  const handleUpdatePlayer = (id: string, updates: Partial<PlayerEntry>) => {
    onUpdateSession((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const handleToggleToken = (id: string, token: TokenKind) => {
    onUpdateSession((prev) => ({
      ...prev,
      players: prev.players.map((p) => {
        if (p.id !== id) return p;
        const has = p.tokens.includes(token);
        return { ...p, tokens: has ? p.tokens.filter((t) => t !== token) : [...p.tokens, token] };
      }),
    }));
  };

  const handleSetState = (id: string, state: PlayerState) => {
    onUpdateSession((prev) => {
      const player = prev.players.find((p) => p.id === id);
      const char = player ? allCharacters.find((c) => c.id === player.characterId) : null;
      const phase = prev.ui.currentPhase === "night" ? "night" : "day";

      const journalMsg =
        state === "dead"
          ? `${player?.name} ${t("est mort(e)", "died")}${char && prev.ui.showSecrets ? ` (${t(char.nameFr, char.nameEn)})` : ""}`
          : state === "executed"
            ? `${player?.name} ${t("a été exécuté(e)", "was executed")}${char && prev.ui.showSecrets ? ` (${t(char.nameFr, char.nameEn)})` : ""}`
            : `${player?.name} ${t("est vivant(e)", "is alive")}`;

      return {
        ...prev,
        players: prev.players.map((p) => (p.id === id ? { ...p, state } : p)),
        journal: [
          ...prev.journal,
          {
            id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
            at: new Date().toISOString(),
            phase: phase as "night" | "day",
            message: journalMsg,
          },
        ],
      };
    });
  };

  const handleShuffle = () => {
    onUpdateSession((prev) => {
      const charIds = [...prev.setup.selectedCharacterIds];
      // Fisher-Yates
      for (let i = charIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [charIds[i], charIds[j]] = [charIds[j], charIds[i]];
      }
      return {
        ...prev,
        players: prev.players.map((p, i) => ({
          ...p,
          characterId: charIds[i] || p.characterId,
        })),
        setup: { ...prev.setup, selectedCharacterIds: charIds },
      };
    });
  };

  const handleAdvancePhase = () => {
    onUpdateSession((prev) => {
      const { currentPhase, dayNumber, nightNumber } = prev.ui;
      let next = prev.ui;

      if (currentPhase === "night") {
        next = { ...next, currentPhase: "day", dayNumber: dayNumber + 1 };
      } else if (currentPhase === "day") {
        next = { ...next, currentPhase: "night", nightNumber: nightNumber + 1 };
      } else if (currentPhase === "setup") {
        next = { ...next, currentPhase: "night" };
      }

      const phaseLabel =
        next.currentPhase === "night"
          ? `🌙 ${t("Nuit", "Night")} ${next.nightNumber}`
          : `☀️ ${t("Jour", "Day")} ${next.dayNumber}`;

      return {
        ...prev,
        ui: next,
        journal: [
          ...prev.journal,
          {
            id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
            at: new Date().toISOString(),
            phase: next.currentPhase === "night" ? "night" as const : "day" as const,
            message: `${t("Phase :", "Phase:")} ${phaseLabel}`,
          },
        ],
      };
    });
  };

  const handleToggleSecrets = () => {
    onUpdateSession((prev) => ({
      ...prev,
      ui: { ...prev.ui, showSecrets: !prev.ui.showSecrets },
    }));
  };

  const handleEndGame = () => {
    onUpdateSession((prev) => ({
      ...prev,
      ui: { ...prev.ui, currentPhase: "end" },
      journal: [
        ...prev.journal,
        {
          id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
          at: new Date().toISOString(),
          phase: "day" as const,
          message: `🏁 ${t("Fin de partie", "Game Over")}`,
        },
      ],
    }));
  };

  const handleAddJournalEntry = (message: string) => {
    const phase = session.ui.currentPhase === "night" ? "night" : "day";
    onUpdateSession((prev) => ({
      ...prev,
      journal: [
        ...prev.journal,
        {
          id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
          at: new Date().toISOString(),
          phase: phase as "night" | "day",
          message,
        },
      ],
    }));
  };

  const aliveCount = session.players.filter((p) => p.state === "alive").length;
  const deadCount = session.players.filter((p) => p.state !== "alive").length;

  return (
    <div className="space-y-6">
      {/* Game header */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{
          background: "rgba(20,8,13,0.5)",
          border: "1px solid rgba(139,0,0,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <p className="text-cinzel font-bold text-sm" style={{ color: "#f4ebd0" }}>
              {t(meta.nameFr, meta.nameEn)}
            </p>
            <p className="text-baskerville text-xs" style={{ color: "#8a7a6b" }}>
              {t(`${aliveCount} vivants · ${deadCount} morts`, `${aliveCount} alive · ${deadCount} dead`)}
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg text-cinzel text-xs transition-all duration-200"
          style={{
            background: "rgba(20,8,13,0.5)",
            border: "1px solid rgba(100,100,100,0.2)",
            color: "#8a7a6b",
          }}
        >
          {t("Nouvelle partie", "New Game")}
        </button>
      </div>

      {/* Phase controls */}
      <PhaseControls
        phase={session.ui.currentPhase}
        dayNumber={session.ui.dayNumber}
        nightNumber={session.ui.nightNumber}
        showSecrets={session.ui.showSecrets}
        onAdvancePhase={handleAdvancePhase}
        onToggleSecrets={handleToggleSecrets}
        onEndGame={handleEndGame}
      />

      {/* Players */}
      <PlayerTable
        players={session.players}
        showSecrets={session.ui.showSecrets}
        onUpdatePlayer={handleUpdatePlayer}
        onToggleToken={handleToggleToken}
        onSetState={handleSetState}
        onShuffle={handleShuffle}
      />

      {/* Journal */}
      <JournalPanel
        entries={session.journal}
        currentPhase={session.ui.currentPhase}
        onAddEntry={handleAddJournalEntry}
      />
    </div>
  );
}
