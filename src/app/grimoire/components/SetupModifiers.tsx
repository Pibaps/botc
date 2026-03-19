"use client";

import { useLang } from "@/context/LangContext";
import { type ScriptModifier } from "../types";

interface Props {
  available: ScriptModifier[];
  active: ScriptModifier[];
  onToggle: (modifier: ScriptModifier) => void;
}

export default function SetupModifiers({ available, active, onToggle }: Props) {
  const { t } = useLang();

  if (available.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-cinzel text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
        {t("Modificateurs", "Modifiers")}
      </label>
      <div className="space-y-2">
        {available.map((mod) => {
          const isActive = active.some((m) => m.id === mod.id);

          return (
            <button
              key={mod.id}
              onClick={() => onToggle(mod)}
              className="w-full text-left rounded-lg p-3 flex items-center gap-3 transition-all duration-200"
              style={{
                background: isActive ? "rgba(139,0,0,0.2)" : "rgba(20,8,13,0.4)",
                border: `1px solid ${isActive ? "rgba(139,0,0,0.4)" : "rgba(139,0,0,0.1)"}`,
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-xs"
                style={{
                  background: isActive ? "rgba(139,0,0,0.5)" : "rgba(20,8,13,0.6)",
                  border: `1px solid ${isActive ? "#8B0000" : "rgba(139,0,0,0.2)"}`,
                  color: "#f4ebd0",
                }}
              >
                {isActive ? "✓" : ""}
              </div>
              <div>
                <p className="text-cinzel text-sm font-semibold" style={{ color: "#f4ebd0" }}>
                  {mod.label}
                </p>
                <p className="text-baskerville text-xs" style={{ color: "#8a7a6b" }}>
                  {mod.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
