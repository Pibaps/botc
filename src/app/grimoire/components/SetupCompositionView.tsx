"use client";

import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { type ScriptComposition, type ScriptSlot } from "../types";

interface Props {
  composition: ScriptComposition;
}

const slotArtwork: Record<ScriptSlot, string> = {
  townsfolk: "/assets/botc/wiki.bloodontheclocktower.com/Generic_townsfolk-8b413d1cca.png",
  outsider: "/assets/botc/wiki.bloodontheclocktower.com/Generic_outsider-563466316a.png",
  minion: "/assets/botc/wiki.bloodontheclocktower.com/Generic_minion-23c3efe2fc.png",
  demon: "/assets/botc/wiki.bloodontheclocktower.com/Generic_demon-785cdf7f55.png",
  traveller: "/assets/botc/wiki.bloodontheclocktower.com/Generic_traveller-d0ded6e7f5.png",
  fabled: "/assets/botc/wiki.bloodontheclocktower.com/Generic_fabled-4a94f7639c.png",
};

const slotLabels: Record<ScriptSlot, { en: string; fr: string; color: string }> = {
  townsfolk: { en: "Townsfolk", fr: "Villageois", color: "#4a90d9" },
  outsider: { en: "Outsiders", fr: "Étrangers", color: "#4caf50" },
  minion: { en: "Minions", fr: "Sbires", color: "#ff9800" },
  demon: { en: "Demons", fr: "Démons", color: "#f44336" },
  traveller: { en: "Travellers", fr: "Voyageurs", color: "#9c27b0" },
  fabled: { en: "Fabled", fr: "Légendaires", color: "#c9a84c" },
};

export default function SetupCompositionView({ composition }: Props) {
  const { t } = useLang();
  const activeSlots: ScriptSlot[] = ["townsfolk", "outsider", "minion", "demon"];

  return (
    <div className="space-y-3">
      <label className="text-cinzel text-sm tracking-widest uppercase" style={{ color: "#c9a84c" }}>
        {t("Composition", "Composition")}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {activeSlots.map((slot) => {
          const info = slotLabels[slot];
          const count = composition.totals[slot];

          return (
            <div
              key={slot}
              className="rounded-lg p-3 flex items-center gap-2"
              style={{
                background: "rgba(20,8,13,0.5)",
                border: "1px solid rgba(139,0,0,0.1)",
              }}
            >
              <div className="w-8 h-8 rounded-md overflow-hidden" style={{ background: "rgba(20,8,13,0.4)" }}>
                <Image
                  src={slotArtwork[slot]}
                  alt={t(info.fr, info.en)}
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-cinzel text-xs" style={{ color: info.color }}>
                  {t(info.fr, info.en)}
                </p>
              </div>
              <span className="text-cinzel font-bold" style={{ color: "#f4ebd0" }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
