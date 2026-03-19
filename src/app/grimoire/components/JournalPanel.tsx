"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { type JournalEntry, type GamePhase } from "../types";

interface Props {
  entries: JournalEntry[];
  currentPhase: GamePhase;
  onAddEntry: (message: string) => void;
}

export default function JournalPanel({ entries, currentPhase, onAddEntry }: Props) {
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
      className="rounded-xl p-4"
      style={{
        background: "rgba(20,8,13,0.5)",
        border: "1px solid rgba(139,0,0,0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-cinzel font-bold text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
          ▮ {t("Journal", "Journal")}
        </h3>
        <div className="flex gap-1">
          {(["all", "night", "day"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-2 py-1 rounded text-xs text-cinzel transition-all duration-150"
              style={{
                background: filter === f ? "rgba(139,0,0,0.2)" : "transparent",
                color: filter === f ? "#f4ebd0" : "#666",
              }}
            >
              {f === "all" ? t("Tout", "All") : f === "night" ? "◐" : "◑"}
            </button>
          ))}
        </div>
      </div>

      {/* Add entry */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={t("Ajouter une note...", "Add a note...")}
          className="flex-1 rounded-lg px-3 py-2 text-baskerville text-xs outline-none"
          style={{
            background: "rgba(20,8,13,0.5)",
            border: "1px solid rgba(139,0,0,0.1)",
            color: "#c9b891",
          }}
        />
        <button
          onClick={handleSubmit}
          className="px-3 py-2 rounded-lg text-xs text-cinzel transition-all duration-150"
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
              <span className="text-xs mt-0.5">{entry.phase === "night" ? "◐" : "◑"}</span>
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
