"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import { type JournalEntry, type GamePhase } from "../types";
import { DayIcon, NightIcon } from "./PhaseIcons";

interface Props {
  entries: JournalEntry[];
  currentPhase: GamePhase;
  onAddEntry: (message: string) => void;
  panelId?: string;
}

export default function JournalPanel({ entries, currentPhase, onAddEntry, panelId }: Props) {
  const { t } = useLang();
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "night" | "day">("all");

  const filtered = filter === "all" ? entries : entries.filter((e) => e.phase === filter);

  const handleSubmit = () => {
    if (!newMessage.trim()) return;
    onAddEntry(newMessage.trim());
    setNewMessage("");
  };

  return (
    <div
      id={panelId}
      className="rounded-xl p-4"
      style={{
        background: "rgba(20,8,13,0.5)",
        border: "1px solid rgba(139,0,0,0.15)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h3 className="text-cinzel font-bold text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
          ▮ {t("Journal", "Journal")}
        </h3>
        <div className="flex gap-1 flex-wrap">
          {(["all", "night", "day"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded text-xs text-cinzel transition-all duration-150 ${isMobileBuild ? "min-h-10 px-3 py-2" : "px-2 py-1"}`}
              style={{
                background: filter === f ? "rgba(139,0,0,0.2)" : "transparent",
                color: filter === f ? "#f4ebd0" : "#666",
              }}
            >
              <span className="inline-flex items-center gap-1">
                {f === "all" ? (
                  <span aria-hidden="true">☰</span>
                ) : f === "night" ? (
                  <NightIcon className="h-3.5 w-3.5" />
                ) : (
                  <DayIcon className="h-3.5 w-3.5" />
                )}
                <span>{f === "all" ? t("Tout", "All") : f === "night" ? t("Nuit", "Night") : t("Jour", "Day")}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add entry */}
      <div className={`flex gap-2 mb-3 ${isMobileBuild ? "flex-col" : ""}`}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={t("Ajouter une note...", "Add a note...")}
          className={`flex-1 rounded-lg text-baskerville text-xs outline-none ${isMobileBuild ? "min-h-12 px-4 py-3" : "px-3 py-2"}`}
          style={{
            background: "rgba(20,8,13,0.5)",
            border: "1px solid rgba(139,0,0,0.1)",
            color: "#c9b891",
          }}
        />
        <button
          onClick={handleSubmit}
          className={`rounded-lg text-xs text-cinzel transition-all duration-150 ${isMobileBuild ? "min-h-12 px-4 py-3" : "px-3 py-2"}`}
          style={{
            background: "rgba(139,0,0,0.2)",
            border: "1px solid rgba(139,0,0,0.3)",
            color: "#f4ebd0",
          }}
        >
          +
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        {filtered.length === 0 ? (
          <p className="text-baskerville text-xs text-center py-4" style={{ color: "#555" }}>
            {t("Aucune entrée", "No entries")}
          </p>
        ) : (
          [...filtered].reverse().map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg px-3 py-2 flex items-start gap-2"
              style={{
                background: "rgba(20,8,13,0.3)",
                border: "1px solid rgba(139,0,0,0.05)",
              }}
            >
              {entry.phase === "night" ? (
                <NightIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              ) : (
                <DayIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-baskerville text-xs" style={{ color: "#c9b891" }}>
                  {entry.message}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#444" }}>
                  {new Date(entry.at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
