"use client";

import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { editionMeta } from "@/data/characters";
import { editionArtwork } from "@/data/characterArtwork";
import { type Edition } from "../types";

const editions: Edition[] = ["trouble-brewing", "bad-moon-rising", "sects-and-violets"];

interface Props {
  selected: Edition;
  onSelect: (edition: Edition) => void;
}

export default function SetupEditionCard({ selected, onSelect }: Props) {
  const { t } = useLang();

  return (
    <div className="space-y-3">
      <label className="text-cinzel text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
        {t("Édition", "Edition")}
      </label>
      <div className="grid gap-3">
        {editions.map((ed) => {
          const meta = editionMeta[ed];
          const isSelected = selected === ed;

          return (
            <button
              key={ed}
              onClick={() => onSelect(ed)}
              className="text-left rounded-xl p-4 transition-all duration-200"
              style={{
                background: isSelected
                  ? `rgba(${ed === "trouble-brewing" ? "139,0,0" : ed === "bad-moon-rising" ? "45,21,80" : "26,10,46"},0.4)`
                  : "rgba(20,8,13,0.4)",
                border: `1px solid ${isSelected ? meta.color : "rgba(139,0,0,0.12)"}`,
              }}
            >
              <div className="flex items-center gap-3">
                {editionArtwork[ed] ? (
                  <Image
                    src={editionArtwork[ed]}
                    alt={t(meta.nameFr, meta.nameEn)}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                ) : (
                  <span className="text-2xl">{meta.icon}</span>
                )}
                <div>
                  <p className="text-cinzel font-bold text-sm" style={{ color: isSelected ? "#f4ebd0" : "#c9b891" }}>
                    {t(meta.nameFr, meta.nameEn)}
                  </p>
                  <p className="text-baskerville text-xs mt-0.5" style={{ color: "#8a7a6b" }}>
                    {t(meta.taglineFr, meta.tagline)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
