"use client";

import { useLang } from "@/context/LangContext";

interface Props {
  count: number;
  onChange: (count: number) => void;
}

export default function SetupPlayerCount({ count, onChange }: Props) {
  const { t } = useLang();

  const handleButton = (delta: number) => {
    const next = Math.min(15, Math.max(5, count + delta));
    if (next !== count) onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <label className="text-cinzel text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
          {t("Nombre de joueurs", "Player Count")}
        </label>
        <div className="text-cinzel font-bold text-lg" style={{ color: "#f4ebd0" }}>
          {t("Joueurs", "Players")}: {count}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleButton(-1)}
          className="w-10 h-10 rounded-xl text-cinzel font-bold text-lg transition-all duration-150"
          style={{
            background: "rgba(20,8,13,0.4)",
            border: "1px solid rgba(139,0,0,0.3)",
            color: "#f4ebd0",
          }}
          aria-label={t("Diminuer", "Decrease")}
        >
          –
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={5}
            max={15}
            value={count}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-full accent-red-900"
            style={{
              accentColor: "#8B0000",
              background: "linear-gradient(90deg, rgba(255,107,107,0.9) 0%, rgba(255,107,107,0.6) 100%)",
            }}
          />
          <div className="flex justify-between text-[11px] text-[#8a7a6b] mt-1">
            {Array.from({ length: 11 }, (_, i) => 5 + i).map((n) => (
              <span key={n} className={n === count ? "font-semibold text-[#f4ebd0]" : ""}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleButton(1)}
          className="w-10 h-10 rounded-xl text-cinzel font-bold text-lg transition-all duration-150"
          style={{
            background: "rgba(20,8,13,0.4)",
            border: "1px solid rgba(139,0,0,0.3)",
            color: "#f4ebd0",
          }}
          aria-label={t("Augmenter", "Increase")}
        >
          +
        </button>
      </div>
    </div>
  );
}
