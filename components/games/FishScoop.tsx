"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { games } from "@/data/games";
import { PaperButton } from "@/components/ui/PaperButton";
import { getAudio } from "@/lib/audio";
import { RewardCard } from "./RewardCard";
import { GameLock } from "./GameLock";
import { useGameLimit } from "@/lib/gameLimits";

const COLORS = ["#ff7a2e", "#ffb13d", "#e8472e", "#fff1cf", "#ff9a52", "#2a1406"];
type Fish = { id: number; color: string; x: number[]; y: number[]; flip: number[]; duration: number };
type Splash = { id: number; x: number; y: number };
type Catch = { color: string; rotten: boolean };
const ROTTEN = "#8a9a5b";

function makeFish(id: number, w: number, h: number): Fish {
  const n = 5;
  const x: number[] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    x.push(w * (0.12 + Math.random() * 0.76));
    y.push(h * (0.15 + Math.random() * 0.7));
  }
  x.push(x[0]);
  y.push(y[0]);
  // quay đầu theo hướng bơi
  const flip = x.map((v, i) => (x[(i + 1) % x.length] >= v ? 1 : -1));
  return { id, color: COLORS[id % COLORS.length], x, y, flip, duration: 9 + Math.random() * 7 };
}

function FishShape({ color, rotten }: { color: string; rotten?: boolean }) {
  const dark = color === "#2a1406";
  if (rotten) color = ROTTEN;
  return (
    <svg viewBox="0 0 60 34" className="w-full" aria-hidden overflow="visible">
      {rotten && (
        <g stroke="#b6c46a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.9">
          <path d="M22 2 q-3 -4 0 -8 q3 -4 0 -8" />
          <path d="M32 0 q-3 -4 0 -8 q3 -4 0 -8" />
          <path d="M42 2 q-3 -4 0 -8 q3 -4 0 -8" />
        </g>
      )}
      <path d="M12 17 L0 5 Q4 17 0 29 Z" fill={color} opacity="0.9" />
      <ellipse cx="32" cy="17" rx="22" ry="12" fill={color} />
      <path d="M26 6 q8 -6 14 2" fill={color} opacity="0.85" />
      <path d="M22 20 q6 8 12 4" stroke={dark ? "#4a3a30" : "#fff4e0"} strokeWidth="1.5" fill="none" opacity="0.6" />
      {rotten ? (
        <path d="M42 11 l6 6 M48 11 l-6 6" stroke="#2a2a14" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="45" cy="14" r="3" fill={dark ? "#ffc45c" : "#1a0f06"} />
          <circle cx="46" cy="13" r="1" fill="#fff" />
        </>
      )}
    </svg>
  );
}

/** Vớt cá vàng bằng vợt giấy. Chạm trúng con cá là vớt, vợt yếu dần rồi rách. */
export function FishScoop() {
  const f = games.fishing;
  const pond = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [fish, setFish] = useState<Fish[]>([]);
  const [life, setLife] = useState(f.netLife);
  const [caught, setCaught] = useState<Catch[]>([]);
  const [note, setNote] = useState<{ text: string; rotten: boolean } | null>(null);
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const [showReward, setShowReward] = useState(false);
  const streak = useRef(0);
  const over = life <= 0;
  const limit = useGameLimit("fish");
  const [inRound, setInRound] = useState(false);
  // khoá khi đã trúng thưởng, hoặc hết lượt mà không đang chơi dở
  const locked = !showReward && (limit.won || (!inRound && !over && !limit.canStart));

  const reset = useCallback((w: number, h: number) => {
    setFish(Array.from({ length: f.fishCount }, () => makeFish(nextId.current++, w, h)));
    setLife(f.netLife);
    setCaught([]);
    setNote(null);
    streak.current = 0;
  }, [f.fishCount, f.netLife]);

  useEffect(() => {
    const el = pond.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => {
        if (s.w === 0 && width > 0) reset(width, height);
        return { w: width, h: height };
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [reset]);

  useEffect(() => {
    if (!note) return;
    const t = window.setTimeout(() => setNote(null), note.rotten ? 2200 : 1200);
    return () => window.clearTimeout(t);
  }, [note]);

  const splashAt = (clientX: number, clientY: number) => {
    const r = pond.current!.getBoundingClientRect();
    const id = nextId.current++;
    setSplashes((s) => [...s, { id, x: clientX - r.left, y: clientY - r.top }]);
    window.setTimeout(() => setSplashes((s) => s.filter((p) => p.id !== id)), 700);
  };

  const scoop = (target: Fish, e: React.PointerEvent) => {
    e.stopPropagation();
    if (over || locked) return;
    if (!inRound) {
      // thao tác đầu tiên của một lượt mới mới tính là một lượt chơi
      if (!limit.canStart) return;
      limit.startRound();
      setInRound(true);
    }
    if (life - 1 <= 0) setInRound(false);
    splashAt(e.clientX, e.clientY);
    setLife((l) => l - 1);
    // con nào cũng vớt được, nhưng xịn hay thối là hên xui
    const rotten = Math.random() < f.rottenRate;
    if (rotten) getAudio().thud();
    else getAudio().chime();
    setCaught((c) => [...c, { color: target.color, rotten }]);
    // vớt liền đủ số cá xịn (không dính cá thối) là có thưởng
    streak.current = rotten ? 0 : streak.current + 1;
    if (streak.current >= f.streakForReward) {
      streak.current = 0;
      limit.markWon();
      setInRound(false);
      window.setTimeout(() => setShowReward(true), 700);
    }
    setNote({ text: rotten ? f.rotten : f.good, rotten });
    setFish((all) => all.filter((x) => x.id !== target.id));
    window.setTimeout(() => setFish((all) => [...all, makeFish(nextId.current++, size.w, size.h)]), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-cloud/80">
        <span>
          {f.hint} · <b className="text-glow">{games.playsLeft(limit.left)}</b>
        </span>
        <span className="flex items-center gap-1.5" aria-label={`${f.netLabel}: ${life}/${f.netLife}`}>
          <NetIcon torn={over} />
          {Array.from({ length: f.netLife }, (_, i) => (
            <span key={i} className={`size-1.5 rounded-full ${i < life ? "bg-cloud/85" : "bg-cloud/20"}`} />
          ))}
        </span>
      </div>

      <div
        ref={pond}
        onPointerDown={(e) => !over && splashAt(e.clientX, e.clientY)}
        className="relative mt-3 aspect-[4/3] w-full touch-manipulation overflow-hidden rounded-[22px]"
        style={{
          background: "radial-gradient(120% 90% at 40% 30%, #3fb3d8 0%, #1f78a8 45%, #124a78 100%)",
          boxShadow: "inset 0 0 0 6px #8a4a1c, inset 0 0 0 9px #5a2a10, inset 0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {/* lá sen trang trí */}
        <span aria-hidden className="absolute -left-4 bottom-6 size-16 rounded-full bg-[#2f8a5a]/80" style={{ clipPath: "polygon(50% 50%, 100% 30%, 100% 0, 0 0, 0 100%, 100% 100%, 100% 70%)" }} />
        <span aria-hidden className="absolute -right-3 top-5 size-12 rounded-full bg-[#2f8a5a]/70" style={{ clipPath: "polygon(50% 50%, 0 30%, 0 0, 100% 0, 100% 100%, 0 100%, 0 70%)" }} />

        <AnimatePresence>
        {size.w > 0 &&
          fish.map((fi) => (
            <motion.button
              key={fi.id}
              type="button"
              aria-label="Con cá"
              onPointerDown={(e) => scoop(fi, e)}
              className="absolute left-0 top-0 -ml-8 -mt-6 grid h-12 w-16 place-items-center"
              initial={{ x: fi.x[0], y: fi.y[0], opacity: 0 }}
              animate={{ x: fi.x, y: fi.y, scaleX: fi.flip, opacity: 1 }}
              exit={{ y: fi.y[0] - 60, opacity: 0, scale: 0.6, transition: { duration: 0.5 } }}
              transition={{
                x: { duration: fi.duration, repeat: Infinity, ease: "easeInOut" },
                y: { duration: fi.duration, repeat: Infinity, ease: "easeInOut" },
                scaleX: { duration: fi.duration, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6 },
              }}
            >
              <span className="block w-12">
                <FishShape color={fi.color} />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {splashes.map((s) => (
            <motion.span
              key={s.id}
              className="pointer-events-none absolute size-10 rounded-full border-2 border-white/70"
              style={{ left: s.x - 20, top: s.y - 20 }}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {note && !over && (
            <motion.div
              key={note.text + caught.length}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={note.rotten ? { opacity: 1, y: 0, scale: 1, rotate: [0, -3, 3, -2, 0] } : { opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute inset-x-3 top-3 flex justify-center"
              role="status"
            >
              {note.rotten ? (
                <p className="flex items-center gap-2 rounded-[12px] bg-[#e6efb8] px-3.5 py-2 text-[15px] font-extrabold leading-snug text-[#3a4212] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]">
                  <span className="block w-8 shrink-0">
                    <FishShape color={ROTTEN} rotten />
                  </span>
                  {note.text}
                </p>
              ) : (
                <p className="text-[15px] font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">{note.text}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showReward && (
            <RewardCard reason={games.rewards.fishStreak.reason} prize={games.rewards.fishStreak.prize} onClose={() => setShowReward(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {locked && <GameLock key="lock" reason={limit.won ? "won" : "out"} />}
          {over && !showReward && !locked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a1a3a]/70 px-6 text-center"
            >
              <NetIcon torn big />
              <p className="text-[16px] font-bold leading-snug text-cloud text-balance">{f.torn(caught.filter((c) => !c.rotten).length, caught.filter((c) => c.rotten).length)}</p>
              {limit.canStart ? (
                <PaperButton onClick={() => reset(size.w, size.h)}>{games.again}</PaperButton>
              ) : (
                <p className="text-[14px] text-mist">{games.locked.out}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* túi cá */}
      <div className="mt-3 flex min-h-8 items-center gap-2">
        <span className="text-[13px] text-cloud/70">{f.bag}:</span>
        <div className="flex flex-wrap gap-1">
          {caught.map((c, i) => (
            <motion.span key={i} initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} className="block w-6">
              <FishShape color={c.color} rotten={c.rotten} />
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function NetIcon({ torn, big }: { torn: boolean; big?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={big ? "size-12" : "size-5"} fill="none" aria-hidden>
      <circle cx="13" cy="13" r="10" stroke="#ffc45c" strokeWidth="2.4" />
      <path d="M20 20 L30 30" stroke="#ffc45c" strokeWidth="3" strokeLinecap="round" />
      {torn ? (
        <path d="M6 10 l5 3 l-2 4 l5 2 M16 7 l-2 5 l4 2" stroke="#fff4e0" strokeWidth="1.4" strokeLinecap="round" />
      ) : (
        <circle cx="13" cy="13" r="8.5" fill="#fff4e0" opacity="0.55" />
      )}
    </svg>
  );
}
