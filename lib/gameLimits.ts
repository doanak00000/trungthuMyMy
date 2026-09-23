"use client";

import { useCallback, useEffect, useState } from "react";
import { games } from "@/data/games";

/**
 * Giới hạn lượt chơi, lưu ngay trên máy (localStorage):
 * mỗi trò chơi được 1 lượt + `maxReplays` lượt chơi lại; trúng thưởng rồi thì khoá trò đó.
 * Muốn chơi lại từ đầu khi đang thử trên máy: mở /?resetGames=1 (chỉ khi chạy dev).
 */
export type GameId = "fish" | "claw" | "fortune";
type Record = { plays: number; won: boolean };
type Store = { [K in GameId]?: Record };

export const GAMES_KEY = "tt-games";

function read(): Store {
  try {
    return JSON.parse(window.localStorage.getItem(GAMES_KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    window.localStorage.setItem(GAMES_KEY, JSON.stringify(store));
  } catch {
    /* chế độ ẩn danh: chỉ nhớ trong lần mở này */
  }
}

let memory: Store | null = null;
const listeners = new Set<() => void>();

function load(): Store {
  if (!memory) memory = read();
  return memory;
}

function update(id: GameId, fn: (r: Record) => Record) {
  const store = load();
  store[id] = fn(store[id] ?? { plays: 0, won: false });
  memory = store;
  write(store);
  listeners.forEach((l) => l());
}

export const maxPlays = 1 + games.maxReplays;

/** Trạng thái lượt chơi của một trò. `startRound` gọi ở thao tác đầu tiên của mỗi lượt. */
export function useGameLimit(id: GameId) {
  const [rec, setRec] = useState<Record>({ plays: 0, won: false });

  useEffect(() => {
    const sync = () => setRec({ ...(load()[id] ?? { plays: 0, won: false }) });
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, [id]);

  const startRound = useCallback(() => update(id, (r) => ({ ...r, plays: r.plays + 1 })), [id]);
  const markWon = useCallback(() => update(id, (r) => ({ ...r, won: true })), [id]);

  const left = Math.max(0, maxPlays - rec.plays);
  return {
    won: rec.won,
    plays: rec.plays,
    left,
    /** còn được bắt đầu một lượt mới không */
    canStart: !rec.won && left > 0,
    startRound,
    markWon,
  };
}

export function resetGameLimits() {
  memory = {};
  write({});
  listeners.forEach((l) => l());
}
