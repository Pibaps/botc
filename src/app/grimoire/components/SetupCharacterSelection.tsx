"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useLang } from "@/context/LangContext";
import { type Edition, type ScriptSlot } from "../types";
import { charactersByEdition } from "@/data/characters";
import { characterArtwork } from "@/data/characterArtwork";

interface Props {
  edition: Edition;
  playerCount: number;
  expectedComposition: Record<string, number>;
  selectedCharacterIds: string[];
  onSelectionChange: (ids: string[]) => void;
  mode: "random" | "custom";
  onModeChange: (mode: "random" | "custom") => void;
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

export default function SetupCharacterSelection({
  edition,
  playerCount,
  expectedComposition,
  selectedCharacterIds,
  onSelectionChange,
  mode,
  onModeChange,
}: Props) {
  const { t } = useLang();
  const characters = useMemo(() => charactersByEdition[edition] || [], [edition]);
  const selectedCount = selectedCharacterIds.length;
  const isComplete = selectedCount === playerCount;

  const charactersBySlot = useMemo(() => {
    const result: Record<ScriptSlot, typeof characters> = {
      townsfolk: [],
      outsider: [],
      minion: [],
      demon: [],
      traveller: [],
      fabled: [],
    };

    characters.forEach((char) => {
      result[char.type].push(char);
    });

    return result;
  }, [characters]);

  const selectedBySlot = useMemo(() => {
    const totals: Record<ScriptSlot, number> = {
      townsfolk: 0,
      outsider: 0,
      minion: 0,
      demon: 0,
      traveller: 0,
      fabled: 0,
    };

    selectedCharacterIds.forEach((id) => {
      const char = characters.find((c) => c.id === id);
      if (char) totals[char.type] += 1;
    });

    return totals;
  }, [selectedCharacterIds, characters]);

  const slotLimits: Record<ScriptSlot, number> = {
    townsfolk: expectedComposition.townsfolk ?? 0,
    outsider: expectedComposition.outsider ?? 0,
    minion: expectedComposition.minion ?? 0,
    demon: expectedComposition.demon ?? 0,
    traveller: expectedComposition.traveller ?? 0,
    fabled: expectedComposition.fabled ?? 0,
  };

  const toggleCharacter = (characterId: string) => {
    const char = characters.find((c) => c.id === characterId);
    if (!char) return;

    const isSelected = selectedCharacterIds.includes(characterId);

    if (isSelected) {
      onSelectionChange(selectedCharacterIds.filter((id) => id !== characterId));
      return;
    }

    const slot = char.type;
    const slotCount = selectedBySlot[slot];
    const slotLimit = slotLimits[slot];

    if (selectedCount < playerCount && slotCount < slotLimit) {
      onSelectionChange([...selectedCharacterIds, characterId]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        {mode === "custom" && (
          <div
            className="rounded-lg p-3 text-xs"
            style={{
              background: "rgba(20,8,13,0.25)",
              border: "1px solid rgba(139,0,0,0.15)",
              color: "#c9a84c",
            }}
          >
            {t("Composition attendue", "Expected composition")} :
            <span className="font-semibold">
              {` ${expectedComposition.townsfolk || 0}F / ${expectedComposition.outsider || 0}E / ${expectedComposition.minion || 0}S / ${expectedComposition.demon || 0}D`}
            </span>
          </div>
        )}
      </div>
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange("random")}
          className={`flex-1 py-2 px-3 rounded-lg text-cinzel text-sm font-bold transition-all duration-200 ${
            mode === "random"
              ? "border-2"
              : "border border-opacity-50 hover:border-opacity-75"
          }`}
          style={{
            background: mode === "random" ? "rgba(139,0,0,0.3)" : "rgba(139,0,0,0.1)",
            borderColor: "#c9a84c",
            color: "#f4ebd0",
          }}
        >
          🎲 {t("Aléatoire", "Random")}
        </button>
        <button
          onClick={() => onModeChange("custom")}
          className={`flex-1 py-2 px-3 rounded-lg text-cinzel text-sm font-bold transition-all duration-200 ${
            mode === "custom"
              ? "border-2"
              : "border border-opacity-50 hover:border-opacity-75"
          }`}
          style={{
            background: mode === "custom" ? "rgba(139,0,0,0.3)" : "rgba(139,0,0,0.1)",
            borderColor: "#c9a84c",
            color: "#f4ebd0",
          }}
        >
          ✋ {t("Personnalisé", "Custom")}
        </button>
      </div>

      {mode === "custom" && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-opacity-50 rounded-lg p-3" style={{ background: "rgba(139,0,0,0.15)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-cinzel text-sm" style={{ color: "#c9a84c" }}>
                {t("Sélection des Rôles", "Character Selection")}
              </span>
              <span className="text-cinzel font-bold" style={{ color: isComplete ? "#4caf50" : "#ff9800" }}>
                {selectedCount}/{playerCount}
              </span>
            </div>
            <div className="w-full bg-black rounded-full h-2 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(selectedCount / playerCount) * 100}%`,
                  background: isComplete ? "#4caf50" : "#ff9800",
                }}
              />
            </div>
          </div>

          {/* Character Slots */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(["demon", "minion", "outsider", "townsfolk"] as ScriptSlot[]).map((slot) => {
              const slotChars = charactersBySlot[slot];
              if (slotChars.length === 0) return null;

              const info = slotLabels[slot];
              const slotSelected = selectedCharacterIds.filter((id) =>
                slotChars.some((c) => c.id === id)
              );

              return (
                <div key={slot} className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-md overflow-hidden" style={{ background: "rgba(20,8,13,0.35)" }}>
                      <Image
                        src={slotArtwork[slot]}
                        alt={t(info.fr, info.en)}
                        width={28}
                        height={28}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-cinzel text-xs font-bold uppercase tracking-wider" style={{ color: info.color }}>
                      {t(info.fr, info.en)} ({slotSelected.length}/{slotChars.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-2">
                    {slotChars.map((char) => {
                      const isSelected = selectedCharacterIds.includes(char.id);
                      const slot = char.type;
                      const slotCount = selectedBySlot[slot];
                      const slotLimit = slotLimits[slot];
                      const canToggle = isSelected || (selectedCount < playerCount && slotCount < slotLimit);
                      const charImage = characterArtwork[char.id];

                      return (
                        <button
                          key={char.id}
                          onClick={() => canToggle && toggleCharacter(char.id)}
                          disabled={!canToggle}
                          className={`p-2 rounded-lg text-cinzel text-xs font-semibold transition-all duration-200 ${
                            isSelected ? "" : "hover:opacity-80"
                          } ${!canToggle ? "opacity-50 cursor-not-allowed" : ""}`}
                          style={{
                            background: isSelected
                              ? `${info.color}33`
                              : "rgba(139,0,0,0.15)",
                            border: `1px solid ${info.color}`,
                            color: "#f4ebd0",
                            boxShadow: isSelected ? `inset 0 0 0 2px ${info.color}` : "none",
                          }}
                          title={
                            !canToggle && !isSelected
                              ? t(
                                  "Limite atteinte pour ce type de rôle",
                                  "Slot limit reached for this role type"
                                )
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-[rgba(20,8,13,0.3)] flex items-center justify-center">
                              {charImage ? (
                                <Image
                                  src={charImage}
                                  alt={t(char.nameFr, char.nameEn)}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-[10px] text-[#c9a84c]">
                                  {t(char.nameFr, char.nameEn).slice(0, 2)}
                                </span>
                              )}
                            </div>
                            <span className="truncate">{t(char.nameFr, char.nameEn)}</span>
                            {isSelected && <span className="text-green-400 font-bold">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === "random" && (
        <div
          className="rounded-lg p-4 text-center"
          style={{ background: "rgba(139,0,0,0.15)", border: "1px solid rgba(139,0,0,0.2)" }}
        >
          <p className="text-baskerville text-sm" style={{ color: "#a8968a" }}>
            {t("Les rôles seront sélectionnés aléatoirement", "Roles will be randomly selected")}
          </p>
        </div>
      )}
    </div>
  );
}
