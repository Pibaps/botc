"use client";

import type { ReactNode } from "react";
import { DayIcon, EndIcon, NightIcon, SetupIcon } from "./PhaseIcons";
import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import { type GamePhase } from "../types";

interface Props {
  phase: GamePhase;
  dayNumber: number;
  nightNumber: number;
  showSecrets: boolean;
  onAdvancePhase: () => void;
  onToggleSecrets: () => void;
  onEndGame: () => void;
}

const phaseInfo: Record<GamePhase, { icon: ReactNode; labelEn: string; labelFr: string; color: string }> = {
  setup: { icon: <SetupIcon className="text-xl" />, labelEn: "Setup", labelFr: "Préparation", color: "#607d8b" },
  night: { icon: <NightIcon className="h-5 w-5" />, labelEn: "Night", labelFr: "Nuit", color: "#1a237e" },
  day: { icon: <DayIcon className="h-5 w-5" />, labelEn: "Day", labelFr: "Jour", color: "#c9a84c" },
  end: { icon: <EndIcon className="h-5 w-5 object-contain" />, labelEn: "Game Over", labelFr: "Fin de partie", color: "#8B0000" },
};

export default function PhaseControls({
  phase,
  dayNumber,
  nightNumber,
  showSecrets,
  onAdvancePhase,
  onToggleSecrets,
  onEndGame,
}: Props) {
  const { t } = useLang();
  const info = phaseInfo[phase];

  const phaseLabel =
    phase === "night"
      ? `${t("Nuit", "Night")} ${nightNumber}`
      : phase === "day"
        ? `${t("Jour", "Day")} ${dayNumber}`
        : t(info.labelFr, info.labelEn);

  const nextLabel =
    phase === "night"
      ? t("Passer au Jour", "Start Day")
      : phase === "day"
        ? t("Passer à la Nuit", "Start Night")
        : t("Commencer", "Begin");

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(20,8,13,0.5)",
        border: "1px solid rgba(139,0,0,0.15)",
      }}
    >
      {/* Current phase display */}
      <div className={`flex ${isMobileBuild ? "flex-col items-start gap-3" : "items-center justify-between"} mb-4`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center justify-center text-xl">{info.icon}</span>
          <span className="text-cinzel font-bold" style={{ color: info.color }}>
            {phaseLabel}
          </span>
        </div>
        <button
          onClick={onToggleSecrets}
          className={`rounded-lg text-cinzel text-xs transition-all duration-200 ${isMobileBuild ? "w-full min-h-11 px-4 py-3" : "px-3 py-1.5"}`}
          style={{
            background: showSecrets ? "rgba(139,0,0,0.2)" : "rgba(20,8,13,0.4)",
            border: `1px solid ${showSecrets ? "rgba(139,0,0,0.4)" : "rgba(100,100,100,0.15)"}`,
            color: showSecrets ? "#f4ebd0" : "#666",
          }}
        >
          {showSecrets ? "◈" : "●"} {t(showSecrets ? "Secrets visibles" : "Secrets masqués", showSecrets ? "Secrets Visible" : "Secrets Hidden")}
        </button>
      </div>

      {/* Action buttons */}
      <div className={`flex gap-2 ${isMobileBuild ? "flex-col" : ""}`}>
        {phase !== "end" && (
          <button
            onClick={onAdvancePhase}
            className={`rounded-lg text-cinzel text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.01] ${isMobileBuild ? "w-full min-h-12 py-3.5" : "flex-1 py-2.5"}`}
            style={{
              background: "linear-gradient(135deg, rgba(139,0,0,0.3), rgba(139,0,0,0.15))",
              border: "1px solid rgba(139,0,0,0.4)",
              color: "#f4ebd0",
            }}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {phase === "night" ? <DayIcon className="h-4 w-4" /> : phase === "day" ? <NightIcon className="h-4 w-4" /> : <SetupIcon className="text-base" />}
              <span>{nextLabel}</span>
            </span>
          </button>
        )}
        <button
          onClick={onEndGame}
          className={`rounded-lg text-cinzel text-sm transition-all duration-200 ${isMobileBuild ? "w-full min-h-12 py-3.5" : "px-4 py-2.5"}`}
          style={{
            background: "rgba(20,8,13,0.5)",
            border: "1px solid rgba(100,100,100,0.2)",
            color: "#8a7a6b",
          }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <EndIcon className="h-4 w-4 object-contain" />
            <span>{t("Fin", "End")}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
