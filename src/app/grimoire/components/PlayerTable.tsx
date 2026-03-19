"use client";

import { useLang } from "@/context/LangContext";
import { type PlayerEntry, type TokenKind, type PlayerState } from "../types";
import PlayerCard from "./PlayerCard";

interface Props {
  players: PlayerEntry[];
  showSecrets: boolean;
  onUpdatePlayer: (id: string, updates: Partial<PlayerEntry>) => void;
  onToggleToken: (id: string, token: TokenKind) => void;
  onSetState: (id: string, state: PlayerState) => void;
  onShuffle: () => void;
}

export default function PlayerTable({
  players,
  showSecrets,
  onUpdatePlayer,
  onToggleToken,
  onSetState,
  onShuffle,
}: Props) {
  const { t } = useLang();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-cinzel font-bold text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
          {t("Joueurs", "Players")} ({players.length})
        </h3>
        <button
          onClick={onShuffle}
          className="px-3 py-1.5 rounded-lg text-cinzel text-xs tracking-wide transition-all duration-200"
          style={{
            background: "rgba(139,0,0,0.15)",
            border: "1px solid rgba(139,0,0,0.3)",
            color: "#c9b891",
          }}
        >
          ⬢ {t("Redistribuer", "Shuffle")}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            showSecret={showSecrets}
            onUpdateName={(name) => onUpdatePlayer(player.id, { name })}
            onToggleToken={(token) => onToggleToken(player.id, token)}
            onSetState={(state) => onSetState(player.id, state)}
            onUpdateNotes={(notes) => onUpdatePlayer(player.id, { notes })}
          />
        ))}
      </div>
    </div>
  );
}
