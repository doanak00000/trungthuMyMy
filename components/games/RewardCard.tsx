"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { games } from "@/data/games";
import { PaperButton } from "@/components/ui/PaperButton";
import { getAudio } from "@/lib/audio";

const CONFETTI = ["#ffc45c", "#e8472e", "#25b597", "#d8428f", "#fff4e0"];

/**
 * Phiếu thưởng vàng hiện đè lên khung trò chơi, kèm pháo giấy.
 * Đặt trong một khung `relative`.
 */
export function RewardCard({ reason, prize, onClose }: { reason: string; prize: string; onClose: () => void }) {
  const r = games.rewards;

  useEffect(() => {
    const a = getAudio();
    a.bell(1);
    const t1 = window.setTimeout(() => a.bell(1.26), 160);
    const t2 = window.setTimeout(() => a.bell(1.5), 320);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-[#0a0d2c]/75 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="alertdialog"
      aria-label={`${r.title}: ${prize}`}
    >
      {/* pháo giấy */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2;
          const d = 90 + (i % 5) * 22;
          return (
            <motion.span
              key={i}
              className="absolute block h-2.5 w-1.5 rounded-[1px]"
              style={{ background: CONFETTI[i % CONFETTI.length] }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: Math.cos(a) * d, y: [0, Math.sin(a) * d - 30, Math.sin(a) * d + 60], opacity: [1, 1, 0], rotate: 540 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          );
        })}
      </div>

      {/* phiếu thưởng */}
      <motion.div
        className="relative w-full max-w-[280px] rounded-[14px] px-5 pb-5 pt-4 text-center text-[#4a1606] shadow-[0_24px_50px_-14px_rgba(0,0,0,0.8),0_0_60px_-6px_rgba(255,196,92,0.6)]"
        style={{ background: "linear-gradient(160deg, #ffe39a 0%, #ffc45c 55%, #ffab3d 100%)" }}
        initial={{ scale: 0.5, rotate: -8, y: 30 }}
        animate={{ scale: 1, rotate: -2, y: 0 }}
        transition={{ type: "spring", damping: 11, stiffness: 180 }}
      >
        <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#8a3510]">{r.title}</p>
        <p className="mt-1 text-[14px] font-bold">{reason}</p>
        <motion.p
          className="mt-2 text-[34px] font-extrabold leading-none text-[#c8261a]"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {prize}
        </motion.p>
        <div className="my-3 border-t-2 border-dashed border-[#8a3510]/30" />
        <p className="text-[12.5px] font-semibold text-[#6a2a0c]">{r.claimNote}</p>
        <PaperButton className="mt-3" onClick={onClose}>
          {r.claim}
        </PaperButton>
      </motion.div>
    </motion.div>
  );
}
