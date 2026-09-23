"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { lanterns, type LanternId, type LanternOption } from "@/data/festival";

export type Scene = "intro" | "ticket" | "lantern" | "festival" | "walk" | "bridge" | "gift";
export type LocationId = "mooncake" | "rabbit" | "lion" | "garden";
export type Overlay = null | "promises" | "star" | "firefly";

type StoryState = {
  scene: Scene;
  go: (scene: Scene) => void;
  lantern: LanternOption;
  chooseLantern: (id: LanternId) => void;
  visited: LocationId[];
  visit: (id: LocationId) => void;
  hasStarLantern: boolean;
  awardStarLantern: () => void;
  fireflies: number;
  catchFirefly: () => number;
  overlay: Overlay;
  setOverlay: (o: Overlay) => void;
  restart: () => void;
};

const StoryContext = createContext<StoryState | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<Scene>("intro");
  const [lanternId, setLanternId] = useState<LanternId>("star");
  const [visited, setVisited] = useState<LocationId[]>([]);
  const [hasStarLantern, setHasStarLantern] = useState(false);
  const [fireflies, setFireflies] = useState(0);
  const [overlay, setOverlay] = useState<Overlay>(null);

  // Chỉ khi chạy dev: ?scene=festival&visited=3 để nhảy thẳng tới một màn.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const q = new URLSearchParams(window.location.search);
    const s = q.get("scene") as Scene | null;
    if (s) setScene(s);
    const l = q.get("lantern") as LanternId | null;
    if (l) setLanternId(l);
    const v = Number(q.get("visited") ?? 0);
    if (v) setVisited((["mooncake", "lion", "rabbit", "garden"] as LocationId[]).slice(0, v));
  }, []);

  const visit = useCallback((id: LocationId) => {
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  }, []);

  const fireflyRef = useRef(0);
  const catchFirefly = useCallback(() => {
    fireflyRef.current += 1;
    setFireflies(fireflyRef.current);
    return fireflyRef.current;
  }, []);

  const restart = useCallback(() => {
    setVisited([]);
    setOverlay(null);
    setScene("intro");
  }, []);

  const value = useMemo<StoryState>(
    () => ({
      scene,
      go: (s) => {
        window.scrollTo(0, 0);
        setScene(s);
      },
      lantern: lanterns.find((l) => l.id === lanternId) ?? lanterns[0],
      chooseLantern: setLanternId,
      visited,
      visit,
      hasStarLantern,
      awardStarLantern: () => setHasStarLantern(true),
      fireflies,
      catchFirefly,
      overlay,
      setOverlay,
      restart,
    }),
    [scene, lanternId, visited, visit, hasStarLantern, fireflies, catchFirefly, overlay, restart],
  );

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used inside StoryProvider");
  return ctx;
}
