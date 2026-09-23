"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { messages } from "@/data/messages";
import { getAudio } from "@/lib/audio";
import { GlowDefs, glow as glowFill } from "@/components/ui/GlowDefs";

type Bloom = { x: number; y: number; s: number; color: string; special?: boolean };

const BLOOMS: Bloom[] = [
  { x: 12, y: 62, s: 0.8, color: "#6c5bd6" },
  { x: 28, y: 74, s: 1, color: "#d8428f" },
  { x: 45, y: 58, s: 0.7, color: "#9b8cff" },
  { x: 60, y: 70, s: 1.25, color: "#ffd47a", special: true },
  { x: 77, y: 60, s: 0.85, color: "#d8428f" },
  { x: 90, y: 76, s: 0.9, color: "#6c5bd6" },
  { x: 20, y: 88, s: 0.75, color: "#9b8cff" },
  { x: 82, y: 90, s: 0.7, color: "#d8428f" },
];

function Flower({ color, glow }: { color: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 60 90" className="w-full" aria-hidden overflow="visible">
      {glow && (
        <>
          <GlowDefs />
          <circle cx="30" cy="26" r="46" fill={glowFill(color)} className="anim-flicker" />
        </>
      )}
      <path d="M30 40 C 28 60, 32 72, 30 90" stroke="#1d4a45" strokeWidth="2.4" fill="none" />
      <path d="M30 66 C 20 60, 14 62, 10 68 C 18 70, 24 70, 30 66 Z" fill="#1d4a45" />
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx="30" cy="16" rx="7" ry="12" fill={color} opacity={glow ? 1 : 0.8} transform={`rotate(${i * 60} 30 26)`} />
      ))}
      <circle cx="30" cy="26" r="5.5" fill={glow ? "#fff6d8" : "#ffe6a4"} />
    </svg>
  );
}

/** Góc vườn bí mật: tối và yên. Có một bông sáng hơn — chạm vào sẽ thấy một câu. */
export function FlowerGarden() {
  const g = messages.garden;
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      <p className="text-[15px] text-mist">{g.sub}</p>
      <div className="relative mx-auto mt-4 aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-[18px]" style={{ background: "radial-gradient(90% 70% at 50% 100%, #1a1f5a 0%, #0a0d2c 70%)" }}>
        {/* lối đi */}
        <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden preserveAspectRatio="none">
          <path d="M150 300 C 180 250, 250 240, 240 200 C 232 170, 260 160, 300 150" stroke="#2a3180" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.6" />
          {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((t, i) => (
            <circle key={t} cx={150 + 150 * t} cy={300 - 150 * t + (i % 2 ? 6 : -6)} r="2" fill="#ffe6a4" className="anim-shimmer" style={{ animationDelay: `${-i * 0.6}s` }} />
          ))}
        </svg>
        {BLOOMS.map((b, i) => {
          const style = { left: `${b.x}%`, top: `${b.y}%`, width: `${10 * b.s}%` };
          return b.special ? (
            <motion.button
              key={i}
              type="button"
              aria-label="Bông hoa đang sáng"
              onClick={() => {
                setOpen(true);
                getAudio().bell(1.2);
              }}
              className="absolute -translate-x-1/2 -translate-y-full p-2"
              style={style}
              animate={open ? { scale: 1.15 } : { scale: [1, 1.06, 1] }}
              transition={open ? { duration: 0.6 } : { duration: 3, repeat: Infinity }}
            >
              <Flower color={b.color} glow />
            </motion.button>
          ) : (
            <div key={i} className="anim-sway-small absolute origin-bottom -translate-x-1/2 -translate-y-full" style={{ ...style, animationDelay: `${-i}s` }}>
              <Flower color={b.color} />
            </div>
          );
        })}
      </div>

      <div className="mt-6 min-h-[112px]" aria-live="polite">
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.6 }}>
              <p className="font-hand text-[19px] leading-[1.8] text-moon text-balance">{g.line}</p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }} className="mt-3 text-[14px] text-mist">
                {g.after}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
