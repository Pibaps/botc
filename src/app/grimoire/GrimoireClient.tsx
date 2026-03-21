"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type GrimoireSession } from "./types";
import { loadGrimoire, saveGrimoire, clearGrimoire } from "./storage";
import SetupWizard from "./components/SetupWizard";
import GrimoireBoard from "./components/GrimoireBoard";

export default function GrimoireClient() {
  const [session, setSession] = useState<GrimoireSession | null>(() => loadGrimoire());
  const [loaded, setLoaded] = useState(false);
  const sessionRef = useRef<GrimoireSession | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Save to localStorage on every session change
  useEffect(() => {
    if (loaded && session) {
      saveGrimoire(session);
    }
  }, [session, loaded]);

  useEffect(() => {
    if (!loaded) return;

    const flushSession = () => {
      if (sessionRef.current) {
        saveGrimoire(sessionRef.current);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushSession();
      }
    };

    window.addEventListener("pagehide", flushSession);
    window.addEventListener("beforeunload", flushSession);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", flushSession);
      window.removeEventListener("beforeunload", flushSession);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loaded]);

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
