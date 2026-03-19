"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/context/LangContext";
import { type Edition, type ScriptModifier, type GrimoireSession } from "../types";
import { buildScriptComposition, getAvailableModifiers, pickCharactersForScript, randomizePlayers, generateId, validateComposition, getCompositionFromSelection } from "../utils";
import { charactersByEdition } from "@/data/characters";
import SetupEditionCard from "./SetupEditionCard";
import SetupPlayerCount from "./SetupPlayerCount";
import SetupCompositionView from "./SetupCompositionView";
import SetupModifiers from "./SetupModifiers";
import SetupCharacterSelection from "./SetupCharacterSelection";

interface Props {
  onStart: (session: GrimoireSession) => void;
}

export default function SetupWizard({ onStart }: Props) {
  const { t } = useLang();
  const [edition, setEdition] = useState<Edition>("trouble-brewing");
  const [playerCount, setPlayerCount] = useState(7);
  const [activeModifiers, setActiveModifiers] = useState<ScriptModifier[]>([]);
  const [compositionMode, setCompositionMode] = useState<"random" | "custom">("random");
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);

  const availableModifiers = useMemo(() => getAvailableModifiers(edition), [edition]);

  const expectedComposition = useMemo(
    () => buildScriptComposition(playerCount, activeModifiers),
    [playerCount, activeModifiers]
  );

  const composition = useMemo(() => {
    if (compositionMode === "custom" && selectedCharacterIds.length > 0) {
      return getCompositionFromSelection(selectedCharacterIds, edition);
    }

    // Random mode: use automatic composition
    return expectedComposition;
  }, [compositionMode, selectedCharacterIds, edition, expectedComposition]);

  // Validation
  const validation = useMemo(
    () => validateComposition(composition, playerCount, activeModifiers, t, compositionMode === "custom" ? expectedComposition : undefined),
    [composition, playerCount, activeModifiers, t, compositionMode, expectedComposition]
  );

  const canCreate = compositionMode === "random" || selectedCharacterIds.length === playerCount;

  // Reset modifiers when edition changes
  const handleEditionChange = (ed: Edition) => {
    setEdition(ed);
    setActiveModifiers([]);
    setSelectedCharacterIds([]);
  };

  const handleToggleModifier = (mod: ScriptModifier) => {
    setActiveModifiers((prev) =>
      prev.some((m) => m.id === mod.id)
        ? prev.filter((m) => m.id !== mod.id)
        : [...prev, mod]
    );
  };

  const handleCreate = () => {
    const characters =
      compositionMode === "custom" && selectedCharacterIds.length > 0
        ? charactersByEdition[edition].filter((c) => selectedCharacterIds.includes(c.id))
        : pickCharactersForScript(edition, composition);

    const players = randomizePlayers(characters, playerCount);
    const now = new Date().toISOString();

    const session: GrimoireSession = {
      version: 1,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      edition,
      setup: {
        playerCount,
        script: composition,
        selectedCharacterIds: characters.map((c) => c.id),
        modifiers: activeModifiers,
        compositionMode,
      },
      players,
      journal: [],
      ui: {
        currentPhase: "night",
        showSecrets: true,
        dayNumber: 0,
        nightNumber: 1,
      },
    };

    onStart(session);
  };

  return (
    <div
      className="rounded-2xl p-6 md:p-8 space-y-6"
      style={{
        background: "rgba(20,8,13,0.6)",
        border: "1px solid rgba(201,168,76,0.15)",
      }}
    >
      <div className="text-center mb-2">
        <h2 className="text-cinzel font-bold text-xl" style={{ color: "#f4ebd0" }}>
          {t("Nouvelle Partie", "New Game")}
        </h2>
        <p className="text-baskerville text-sm mt-1" style={{ color: "#8a7a6b" }}>
          {t("Configurez votre session de jeu", "Configure your game session")}
        </p>
      </div>

      <SetupEditionCard selected={edition} onSelect={handleEditionChange} />
      <SetupPlayerCount count={playerCount} onChange={setPlayerCount} />
      <SetupCompositionView composition={composition} />
      
      {/* Character Selection */}
      <SetupCharacterSelection
        edition={edition}
        playerCount={playerCount}
        expectedComposition={expectedComposition.totals}
        selectedCharacterIds={selectedCharacterIds}
        onSelectionChange={setSelectedCharacterIds}
        mode={compositionMode}
        onModeChange={setCompositionMode}
      />

      <SetupModifiers
        available={availableModifiers}
        active={activeModifiers}
        onToggle={handleToggleModifier}
      />

      {/* Validation Messages */}
      {!validation.valid && (
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "rgba(244,67,54,0.15)", border: "1px solid rgba(244,67,54,0.3)" }}
        >
          {validation.errors.map((error, i) => (
            <p key={i} className="text-baskerville text-sm" style={{ color: "#ff6b6b" }}>
              ⚠️ {error}
            </p>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "rgba(255,152,0,0.15)", border: "1px solid rgba(255,152,0,0.3)" }}
        >
          {validation.warnings.map((warning, i) => (
            <p key={i} className="text-baskerville text-sm" style={{ color: "#ffb74d" }}>
              ℹ️ {warning}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={!canCreate || !validation.valid}
        className={`w-full py-3 rounded-xl text-cinzel font-bold tracking-wide transition-all duration-200 ${
          canCreate && validation.valid ? "hover:scale-[1.01] cursor-pointer" : "opacity-50 cursor-not-allowed"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(139,0,0,0.4), rgba(139,0,0,0.2))",
          border: "1px solid rgba(139,0,0,0.5)",
          color: "#f4ebd0",
          fontSize: "0.95rem",
        }}
      >
        ✦ {t("Créer la Partie", "Create Game")}
      </button>
    </div>
  );
}
