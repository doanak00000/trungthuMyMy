"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { messages } from "@/data/messages";
import { getAudio } from "@/lib/audio";
import { LionDance } from "./LionDance";
import { TapIcon } from "@/components/ui/TapIcon";

const CONFETTI = ["#ffc45c", "#e8472e", "#25b597", "#d8428f", "#fff4e0"];

/**
 * Lân múa ngay trên phố, tự múa suốt. Chạm vào thì lân nhảy vọt, trống vang,
 * tung giấy màu và nói một câu.
 */
export function LionSpot({ onDance }: { onDance: () => void }) {
  const [round, setRound] = useState(0);
  const [burst, setBurst] = useState(false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    if (!round) return;
    setBurst(true);
    setBubble(true);
    const a = window.setTimeout(() => setBurst(false), 1700);
    const b = window.setTimeout(() => setBubble(false), 3800);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [round]);

  const dance = () => {
    setRound((r) => r + 1);
    getAudio().drums();
    onDance();
  };

  return (
    <div className="relative">
      <button type="button" aria-label="Múa lân" onClick={dance} className="block w-full">
        <LionDance burst={burst} className="w-full" />
      </button>

      {/* ngón tay chỉ: chạm vào lân đi */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[46%] top-[-6%] w-[20%]"
        animate={{ y: [0, 10, 0], opacity: burst ? 0 : 1 }}
        transition={{ y: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } }}
      >
        <TapIcon />
      </motion.div>

      {/* giấy màu */}
      <AnimatePresence>
        {burst && (
          <div key={round} className="pointer-events-none absolute left-[36%] top-[30%]">
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2;
              const dist = 56 + (i % 4) * 18;
              return (
                <motion.span
                  key={i}
                  className="absolute block h-2 w-1.5 rounded-[1px]"
                  style={{ background: CONFETTI[i % CONFETTI.length] }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: Math.cos(a) * dist, y: [0, Math.sin(a) * dist - 36, Math.sin(a) * dist + 44], opacity: [1, 1, 0], rotate: 360 + i * 40 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubble && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="pointer-events-none absolute bottom-[104%] left-1/2 w-[max(180px,120%)] -translate-x-1/2 rounded-[14px] bg-cloud px-3.5 py-2.5 text-center text-[14px] font-semibold leading-snug text-[#2a1406] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
          >
            {messages.lion.line}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-cloud" />
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
