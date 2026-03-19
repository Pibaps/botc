"use client";

import { useState, useEffect, useCallback } from "react";
import { type GrimoireSession } from "./types";
import { loadGrimoire, saveGrimoire, clearGrimoire } from "./storage";
import SetupWizard from "./components/SetupWizard";
import GrimoireBoard from "./components/GrimoireBoard";

export default function GrimoireClient() {
  const [session, setSession] = useState<GrimoireSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadGrimoire();
    if (saved) {
      setSession(saved);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on every session change
  useEffect(() => {
    if (loaded && session) {
      saveGrimoire(session);
    }
  }, [session, loaded]);

  const handleStart = useCallback((newSession: GrimoireSession) => {
    setSession(newSession);
  }, []);

  const handleUpdateSession = useCallback(
    (updater: (prev: GrimoireSession) => GrimoireSession) => {
      setSession((prev) => {
        if (!prev) return prev;
        return updater(prev);
      });
    },
    []
  );

  const handleReset = useCallback(() => {
    clearGrimoire();
    setSession(null);
  }, []);

  // Don't render until we've checked localStorage
  if (!loaded) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "50dvh" }}>
        <div className="text-cinzel text-sm" style={{ color: "#8a7a6b" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    return <SetupWizard onStart={handleStart} />;
  }

  return (
    <GrimoireBoard
      session={session}
      onUpdateSession={handleUpdateSession}
      onReset={handleReset}
    />
  );
}
