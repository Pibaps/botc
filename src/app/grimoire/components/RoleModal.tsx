"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { characterArtwork } from "@/data/characterArtwork";
import type { Character } from "@/data/characters";

interface Props {
  character: Character;
  onClose: () => void;
}

export default function RoleModal({ character, onClose }: Props) {
  const { t } = useLang();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t("Fermer", "Close")}
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl"
        style={{ background: "linear-gradient(145deg, rgba(20,8,13,0.98), rgba(10,5,6,0.99))", borderColor: "rgba(201,168,76,0.22)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, rgba(201,168,76,0.15), transparent 60%)` }} />

        <div className="relative flex items-start gap-4 p-5 sm:p-6">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(201,168,76,0.22)" }}>
            {characterArtwork[character.id] ? (
              <Image src={characterArtwork[character.id]} alt={t(character.nameFr, character.nameEn)} fill sizes="80px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/30 text-3xl">{character.type === "townsfolk" ? "🏘️" : character.type === "outsider" ? "🌿" : character.type === "minion" ? "🗡️" : "👹"}</div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase text-cinzel" style={{ color: "#8B0000" }}>
                  {t("Description du rôle", "Role description")}
                </p>
                <h3 className="text-cinzel text-2xl font-bold leading-tight" style={{ color: "#f4ebd0" }}>
                  {t(character.nameFr, character.nameEn)}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border"
                style={{ borderColor: "rgba(201,168,76,0.18)", color: "#c9a84c", background: "rgba(201,168,76,0.06)" }}
                aria-label={t("Fermer", "Close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest" style={{ background: "rgba(20,8,13,0.7)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.18)" }}>
                {t(character.type === "townsfolk" ? "Villageois" : character.type === "outsider" ? "Étranger" : character.type === "minion" ? "Sbire" : character.type === "demon" ? "Démon" : character.type, character.type)}
              </span>
              <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest" style={{ background: "rgba(20,8,13,0.7)", color: "#6b7a8d", border: "1px solid rgba(107,122,141,0.18)" }}>
                {t("Édition", "Edition")}: {character.edition}
              </span>
            </div>
          </div>
        </div>

        <div className="relative px-5 pb-5 sm:px-6 sm:pb-6 space-y-4">
          <div className="rounded-2xl border p-4" style={{ background: "rgba(20,8,13,0.45)", borderColor: "rgba(139,0,0,0.12)" }}>
            <p className="text-xs tracking-widest uppercase text-cinzel mb-2" style={{ color: "#8B0000" }}>
              {t("Capacité", "Ability")}
            </p>
            <p className="text-baskerville leading-relaxed" style={{ color: "#c9b891" }}>
              {t(character.abilityFr, character.ability)}
            </p>
          </div>

          <div className="rounded-2xl border p-4" style={{ background: "rgba(20,8,13,0.35)", borderColor: "rgba(201,168,76,0.12)" }}>
            <p className="text-xs tracking-widest uppercase text-cinzel mb-2" style={{ color: "#8B0000" }}>
              {t("Résumé", "Summary")}
            </p>
            <p className="text-baskerville leading-relaxed text-sm" style={{ color: "#9ca8b5" }}>
              {t(character.summaryFr, character.summary)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}