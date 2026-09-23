"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { games } from "@/data/games";
import { PaperButton } from "@/components/ui/PaperButton";
import { getAudio } from "@/lib/audio";
import { RewardCard } from "./RewardCard";
import { GameLock } from "./GameLock";
import { useGameLimit } from "@/lib/gameLimits";

/** Vị trí ngang (0–1) của từng con thú trong máy */
const SPOTS = [0.28, 0.48, 0.68, 0.87];
const CHUTE_X = 0.06;

type Phase = "aim" | "down" | "up" | "carry" | "back";

/** Máy gắp thú: móc chạy qua lại, bấm Gắp để móc thả xuống. Gắp được thú là có thưởng. */
export function ClawMachine() {
  const c = games.claw;
  const reward = games.rewards.claw;
  const clawX = useMotionValue(0.3);
  const clawLeft = useTransform(clawX, (v) => `${v * 100}%`);
  const clawDrop = useMotionValue(0); // 0 = trên cùng, 1 = chạm đống thú
  // móc tụt từ đỉnh lồng xuống tới ngang lưng đống thú (~75% chiều cao lồng)
  const clawTop = useTransform(clawDrop, (v) => `calc(${4 + v * 71}% - ${v * 56}px)`);
  const sweep = useRef<AnimationPlaybackControls | null>(null);
  const [phase, setPhase] = useState<Phase>("aim");
  const [tries, setTries] = useState(c.tries);
  const [toys, setToys] = useState<number[]>(SPOTS.map((_, i) => i));
  const [holding, setHolding] = useState<number | null>(null);
  const [won, setWon] = useState<number[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const rewarded = useRef(false);
  const over = tries <= 0 && phase === "aim";
  const limit = useGameLimit("claw");
  const [inRound, setInRound] = useState(false);
  const locked = !showReward && (limit.won || (!inRound && !over && !limit.canStart));

  const startSweep = () => {
    sweep.current?.stop();
    sweep.current = animate(clawX, [0.2, 0.93], { duration: 1.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
  };

  useEffect(() => {
    startSweep();
    return () => sweep.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!note) return;
    const t = window.setTimeout(() => setNote(null), 1400);
    return () => window.clearTimeout(t);
  }, [note]);

  const grab = async () => {
    if (phase !== "aim" || tries <= 0 || locked) return;
    if (!inRound) {
      // lần gắp đầu tiên của một lượt mới mới tính là một lượt chơi
      if (!limit.canStart) return;
      limit.startRound();
      setInRound(true);
    }
    if (tries - 1 <= 0) setInRound(false);
    sweep.current?.stop();
    setPhase("down");
    setNote(null);
    getAudio().thud();
    const x = clawX.get();
    const target = toys.find((i) => Math.abs(SPOTS[i] - x) < c.tolerance);

    await animate(clawDrop, 1, { duration: 0.9, ease: "easeIn" });
    const caught = target !== undefined && Math.random() >= c.slipRate;
    if (caught) {
      setHolding(target!);
      setToys((t) => t.filter((i) => i !== target));
    }
    setPhase("up");
    await animate(clawDrop, 0, { duration: 0.9, ease: "easeOut" });

    if (caught) {
      setPhase("carry");
      await animate(clawX, CHUTE_X, { duration: 0.9, ease: "easeInOut" });
      setHolding(null);
      setWon((w) => [...w, target!]);
      setNote(c.got);
      getAudio().chime();
      if (!rewarded.current) {
        rewarded.current = true;
        limit.markWon();
        setInRound(false);
        window.setTimeout(() => setShowReward(true), 500);
      }
    } else {
      setNote(target !== undefined ? c.slipped : c.miss);
    }
    setTries((n) => n - 1);
    setPhase("aim");
    if (tries - 1 > 0) startSweep();
  };

  const reset = () => {
    setTries(c.tries);
    setToys(SPOTS.map((_, i) => i));
    setWon([]);
    setNote(null);
    rewarded.current = false;
    clawDrop.set(0);
    startSweep();
  };

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-cloud/80">
        <span>{c.hint}</span>
        <span className="text-right font-semibold text-glow">
          {c.triesLeft(tries)} · {games.playsLeft(limit.left)}
        </span>
      </div>

      {/* thân máy */}
      <div className="relative mt-3 rounded-[22px] bg-[#d8428f] p-2.5 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.7)]">
        <div className="mb-2 flex items-center justify-center gap-2 rounded-[12px] bg-[#8e2358] py-1.5 text-[13px] font-extrabold tracking-[0.1em] text-[#ffe3a1]">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.span
              key={i}
              className="size-1.5 rounded-full bg-glow"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          GẮP THÚ
        </div>

        {/* lồng kính */}
        <div
          className="relative aspect-[4/3.4] w-full overflow-hidden rounded-[14px]"
          style={{ background: "linear-gradient(180deg, #2a1f6e 0%, #3a2a8a 60%, #4a2e8e 100%)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.15)" }}
        >
          {/* thanh ray trên cùng */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-2.5 bg-[#1a1450]" />
          {/* ống thả thú */}
          <div aria-hidden className="absolute bottom-0 left-0 h-[34%] w-[13%] rounded-tr-[10px] bg-[#1a1450]/80">
            <div className="absolute inset-x-1 top-1 h-1.5 rounded-full bg-glow/50" />
          </div>
          {/* đáy đống thú */}
          <div aria-hidden className="absolute bottom-0 left-[13%] right-0 h-[16%] rounded-t-[40%] bg-[#6c3aa8]" />

          {/* thú bông */}
          {SPOTS.map((sx, i) =>
            toys.includes(i) ? (
              <div
                key={i}
                className="absolute bottom-[9%] w-[19%] -translate-x-1/2"
                style={{ left: `${sx * 100}%` }}
              >
                <Toy id={c.toys[i].id} />
              </div>
            ) : null,
          )}

          {/* móc gắp */}
          <motion.div className="absolute inset-y-0 w-0" style={{ left: clawLeft }}>
            <motion.div aria-hidden className="absolute left-[-1px] top-0 w-0.5 bg-[#c9c3e6]" style={{ height: clawTop }} />
            <motion.div className="absolute w-16 -translate-x-1/2" style={{ top: clawTop }}>
              <ClawShape closed={phase === "up" || phase === "carry" || holding !== null} />
              {holding !== null && (
                <div className="absolute left-1/2 top-[70%] w-[90%] -translate-x-1/2">
                  <Toy id={c.toys[holding].id} />
                </div>
              )}
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {note && !over && (
              <motion.p
                key={note + tries}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-0 top-[38%] text-center text-[16px] font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]"
              >
                {note}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {locked && <GameLock key="lock" reason={limit.won ? "won" : "out"} />}
            {over && !showReward && !locked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#140c3a]/75 px-6 text-center"
              >
                <p className="text-[16px] font-bold leading-snug text-cloud text-balance">{c.done(won.length)}</p>
                {limit.canStart ? (
                  <PaperButton onClick={reset}>{games.again}</PaperButton>
                ) : (
                  <p className="text-[14px] text-mist">{games.locked.out}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showReward && <RewardCard reason={reward.reason} prize={reward.prize} onClose={() => setShowReward(false)} />}
          </AnimatePresence>
        </div>
      </div>

      {/* thú đã gắp được */}
      <div className="mt-3 flex min-h-10 items-center gap-2">
        {won.map((i, k) => (
          <motion.span key={k} initial={{ scale: 0, y: -16 }} animate={{ scale: 1, y: 0 }} className="block w-9">
            <Toy id={c.toys[i].id} />
          </motion.span>
        ))}
      </div>

      <div className="mt-2 flex justify-center">
        <PaperButton onClick={grab} disabled={phase !== "aim" || tries <= 0 || locked} className={phase !== "aim" || tries <= 0 || locked ? "opacity-50" : ""}>
          {c.grab}
        </PaperButton>
      </div>
    </div>
  );
}

function ClawShape({ closed }: { closed: boolean }) {
  return (
    <svg viewBox="0 0 64 56" className="w-full" aria-hidden overflow="visible">
      <rect x="22" y="0" width="20" height="12" rx="3" fill="#c9c3e6" />
      <rect x="18" y="10" width="28" height="6" rx="3" fill="#8e86c4" />
      <motion.path
        d="M24 16 L10 36 L18 52"
        stroke="#e6e1ff"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ originX: "24px", originY: "16px" }}
        animate={{ rotate: closed ? -14 : 8 }}
      />
      <motion.path
        d="M40 16 L54 36 L46 52"
        stroke="#e6e1ff"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ originX: "40px", originY: "16px" }}
        animate={{ rotate: closed ? 14 : -8 }}
      />
    </svg>
  );
}

function Toy({ id }: { id: string }) {
  if (id === "bunny") {
    return (
      <svg viewBox="0 0 48 52" className="w-full" aria-hidden>
        <ellipse cx="17" cy="10" rx="4.5" ry="11" fill="#fff4f8" />
        <ellipse cx="31" cy="10" rx="4.5" ry="11" fill="#fff4f8" />
        <ellipse cx="17" cy="10" rx="2" ry="7" fill="#ffb3c9" />
        <ellipse cx="31" cy="10" rx="2" ry="7" fill="#ffb3c9" />
        <circle cx="24" cy="26" r="12" fill="#fff4f8" />
        <ellipse cx="24" cy="43" rx="13" ry="9" fill="#fff4f8" />
        <circle cx="19.5" cy="24" r="1.7" fill="#3a2140" />
        <circle cx="28.5" cy="24" r="1.7" fill="#3a2140" />
        <circle cx="16" cy="29" r="2.2" fill="#ffadc4" opacity="0.8" />
        <circle cx="32" cy="29" r="2.2" fill="#ffadc4" opacity="0.8" />
      </svg>
    );
  }
  if (id === "cat") {
    return (
      <svg viewBox="0 0 48 52" className="w-full" aria-hidden>
        <path d="M12 20 L14 6 L22 15 Z M36 20 L34 6 L26 15 Z" fill="#9aa0b8" />
        <circle cx="24" cy="24" r="13" fill="#b8bdd4" />
        <ellipse cx="24" cy="43" rx="14" ry="9" fill="#b8bdd4" />
        <circle cx="19" cy="23" r="1.8" fill="#1a1a2a" />
        <circle cx="29" cy="23" r="1.8" fill="#1a1a2a" />
        <path d="M22 28 q2 2 4 0" stroke="#1a1a2a" strokeWidth="1.3" fill="none" />
        <path d="M8 27 h8 M32 27 h8" stroke="#fff" strokeWidth="1" opacity="0.8" />
      </svg>
    );
  }
  if (id === "duck") {
    return (
      <svg viewBox="0 0 48 52" className="w-full" aria-hidden>
        <circle cx="24" cy="20" r="12" fill="#ffd84a" />
        <ellipse cx="24" cy="40" rx="16" ry="11" fill="#ffd84a" />
        <ellipse cx="24" cy="25" rx="6" ry="3" fill="#ff8a2e" />
        <circle cx="19" cy="17" r="1.8" fill="#2a1406" />
        <circle cx="29" cy="17" r="1.8" fill="#2a1406" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 52" className="w-full" aria-hidden>
      <circle cx="13" cy="11" r="6" fill="#c98a4e" />
      <circle cx="35" cy="11" r="6" fill="#c98a4e" />
      <circle cx="24" cy="21" r="13" fill="#d99a5c" />
      <ellipse cx="24" cy="42" rx="14" ry="10" fill="#d99a5c" />
      <ellipse cx="24" cy="25" rx="5" ry="3.5" fill="#f3d3ae" />
      <circle cx="19" cy="18" r="1.8" fill="#2a1406" />
      <circle cx="29" cy="18" r="1.8" fill="#2a1406" />
      <path d="M17 34 l7 4 l7 -4" stroke="#e8472e" strokeWidth="3" fill="none" />
    </svg>
  );
}
