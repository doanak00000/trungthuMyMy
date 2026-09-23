"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { games } from "@/data/games";
import { PaperButton } from "@/components/ui/PaperButton";
import { getAudio } from "@/lib/audio";
import { RewardCard } from "./RewardCard";
import { useGameLimit } from "@/lib/gameLimits";

const SLIP_COLORS = ["#ffc45c", "#ff8cc0", "#8fe3c8", "#ffd9a0", "#c9b8ff", "#ff9a7a"];

/** Hũ thăm may mắn: lắc hũ, một tờ thăm bay ra và mở ra một câu. */
export function FortuneJar() {
  const f = games.fortune;
  const jar = useAnimationControls();
  const last = useRef(-1);
  const limit = useGameLimit("fortune");
  const [slip, setSlip] = useState<{ i: number; key: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [showReward, setShowReward] = useState(false);
  // lá thăm trúng thưởng nằm chung trong hũ, ở vị trí cuối
  const pool = [...f.slips, f.jackpot];
  const JACKPOT = pool.length - 1;

  const draw = async () => {
    // mỗi lần rút là một lượt; trúng thưởng rồi thì khoá luôn
    if (busy || !limit.canStart) return;
    limit.startRound();
    setBusy(true);
    setSlip(null);
    getAudio().thud();
    await jar.start({ rotate: [0, -10, 10, -8, 8, -4, 0], transition: { duration: 0.7 } });
    let i = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && i === last.current) i = (i + 1) % pool.length;
    if (i === JACKPOT) limit.markWon();
    last.current = i;
    getAudio().bell(1.3);
    setSlip({ i, key: Date.now() });
    setBusy(false);
    if (i === JACKPOT) window.setTimeout(() => setShowReward(true), 900);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <p className="self-start text-[13px] text-cloud/80">
        {f.hint} · <b className="text-glow">{games.playsLeft(limit.left)}</b>
      </p>

      <div className="relative mt-4 h-[300px] w-full max-w-[340px]">
        {/* hũ thăm */}
        <motion.button
          type="button"
          aria-label={f.draw}
          onClick={draw}
          animate={jar}
          style={{ originX: 0.5, originY: 1 }}
          className="absolute bottom-0 left-1/2 w-[46%] -translate-x-1/2"
        >
          <svg viewBox="0 0 120 150" className="w-full" aria-hidden overflow="visible">
            {/* thẻ thăm cắm trong hũ */}
            {SLIP_COLORS.map((c, k) => (
              <rect key={c} x={30 + k * 11} y={14 + (k % 3) * 6} width="9" height="58" rx="2" fill={c} transform={`rotate(${(k - 2.5) * 6} ${34 + k * 11} 70)`} />
            ))}
            {/* thân hũ thuỷ tinh */}
            <path d="M22 48 h76 c10 0 14 10 14 22 v52 c0 16 -12 26 -28 26 h-48 c-16 0 -28 -10 -28 -26 v-52 c0 -12 4 -22 14 -22 z" fill="#bfe9ff" opacity="0.28" stroke="#dff6ff" strokeWidth="2" />
            <rect x="18" y="40" width="84" height="12" rx="4" fill="#8e2358" />
            <rect x="18" y="40" width="84" height="4" rx="2" fill="#d8428f" />
            <path d="M28 70 v50" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
            {/* nhãn */}
            <rect x="36" y="90" width="48" height="30" rx="3" fill="#e8472e" />
            <text x="60" y="110" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffe3a1" fontFamily="var(--font-vn)">
              THĂM
            </text>
          </svg>
        </motion.button>

        {/* tờ thăm mở ra */}
        <AnimatePresence>
          {slip && (
            <motion.div
              key={slip.key}
              className="absolute inset-x-2 top-0 z-10 rounded-[6px] px-5 py-5 text-[#3b1206] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
              style={{
                background: slip.i === JACKPOT ? "linear-gradient(160deg, #ffe39a, #ffab3d)" : SLIP_COLORS[slip.i % SLIP_COLORS.length],
                originY: 1,
              }}
              initial={{ y: 170, scaleY: 0.1, scaleX: 0.25, opacity: 0, rotate: -6 }}
              animate={{ y: 0, scaleY: 1, scaleX: 1, opacity: 1, rotate: -1.5 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", damping: 16, stiffness: 140 }}
              role="status"
            >
              <span aria-hidden className="absolute left-1/2 top-2 size-2 -translate-x-1/2 rounded-full bg-[#3b1206]/30" />
              {slip.i === JACKPOT ? (
                <p className="text-[20px] font-extrabold text-[#c8261a]">
                  {f.jackpot} {games.rewards.fortune.prize}
                </p>
              ) : (
                <p className="font-hand text-[17px] leading-[1.75] text-balance">{pool[slip.i]}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showReward && (
          <div className="fixed inset-0 z-50">
            <RewardCard reason={games.rewards.fortune.reason} prize={games.rewards.fortune.prize} onClose={() => setShowReward(false)} />
          </div>
        )}
      </AnimatePresence>

      <div className="mt-5">
        {limit.canStart || busy ? (
          <PaperButton onClick={draw} disabled={busy}>
            {slip ? f.drawAgain : f.draw}
          </PaperButton>
        ) : (
          <p className="max-w-[18rem] text-[15px] font-semibold leading-snug text-glow text-balance">
            {games.locked[limit.won ? "won" : "out"]}
          </p>
        )}
      </div>
    </div>
  );
}
