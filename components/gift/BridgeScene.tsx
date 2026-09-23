"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { PaperButton } from "@/components/ui/PaperButton";
import { Walkers } from "@/components/lantern-walk/Walkers";
import { getAudio } from "@/lib/audio";
import { GlowDefs, glow } from "@/components/ui/GlowDefs";

/** Cây cầu vòm đỏ nhỏ, viewBox 400 × 260, đỉnh cầu ở (200, 110). */
function ArchBridge() {
  const posts = Array.from({ length: 13 }, (_, i) => {
    const t = (i + 0.5) / 13;
    const x = 20 + 360 * t;
    const y = (1 - t) * (1 - t) * 200 + 2 * (1 - t) * t * 20 + t * t * 200;
    return { x, y };
  });
  return (
    <svg viewBox="0 0 400 260" className="absolute inset-0 size-full" aria-hidden overflow="visible">
      <GlowDefs />
      {/* bóng cầu dưới nước */}
      <path d="M20 214 Q200 330 380 214" stroke="#b8200f" strokeWidth="10" fill="none" opacity="0.22" className="anim-ripple" />
      {/* thân vòm */}
      <path d="M20 200 Q200 20 380 200 L380 216 Q200 44 20 216 Z" fill="#9c1c0c" />
      <path d="M20 200 Q200 20 380 200" stroke="#e8472e" strokeWidth="5" fill="none" />
      {/* lan can */}
      <g stroke="#c8261a" strokeWidth="4" strokeLinecap="round">
        {posts.map((p) => (
          <line key={p.x} x1={p.x} y1={p.y} x2={p.x} y2={p.y - 30} />
        ))}
      </g>
      <path d="M20 170 Q200 -10 380 170" stroke="#e8472e" strokeWidth="4" fill="none" />
      {/* đèn hai đầu cầu */}
      {[20, 380].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="140" width="10" height="70" fill="#7a1a0c" />
          <circle cx={x} cy="134" r="56" fill={glow("#ffc45c")} className="anim-flicker" />
          <ellipse cx={x} cy="134" rx="10" ry="12" fill="#ffc45c" />
        </g>
      ))}
    </svg>
  );
}

/** Màn 6 — dừng lại trên cầu dưới trăng. Nhạc nhỏ dần. */
export function BridgeScene() {
  const { lantern, go } = useStory();
  const b = messages.bridge;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    getAudio().setMood("quiet");
    const ts = [1400, 4200, 6400].map((ms, i) => window.setTimeout(() => setStage(i + 1), ms));
    return () => ts.forEach(window.clearTimeout);
  }, []);

  return (
    <motion.section
      className="fixed inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      transition={{ duration: 2 }}
    >
      {/* mặt nước + bóng trăng */}
      <div className="absolute inset-x-0 bottom-0 h-[38svh]" style={{ background: "linear-gradient(180deg, #111a5a 0%, #080c30 100%)" }}>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-[#2d3590]" />
        <div className="absolute left-1/2 top-0 flex h-full w-[46vmin] -translate-x-1/2 flex-col items-center gap-[10px] pt-3 opacity-80">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="anim-ripple block h-[3px] rounded-full bg-moon"
              style={{ width: `${88 - i * 10}%`, opacity: 0.5 - i * 0.06, animationDelay: `${-i * 0.4}s` }}
            />
          ))}
        </div>
      </div>

      {/* cầu + hai đứa */}
      <div className="absolute bottom-[calc(38svh_-_min(92vw,560px,50svh)*0.11)] left-1/2 aspect-[400/260] w-[min(92vw,560px,50svh)] -translate-x-1/2">
        <ArchBridge />
        <div className="absolute bottom-[56%] left-1/2 w-[40%] -translate-x-1/2">
          <Walkers herLantern={lantern.id} walking={false} className="w-full" />
        </div>
      </div>

      {/* lời */}
      <div className="absolute inset-x-0 top-[calc(62svh_+_min(96px,11svh))] flex flex-col items-center gap-2 px-8 text-center [text-shadow:0_2px_14px_rgba(6,8,30,0.95)]">
        <AnimatePresence>
          {stage >= 1 && (
            <motion.p
              key="l1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6 }}
              className="font-hand text-[22px] leading-[1.8] text-moon"
            >
              {b.lines[0]}
            </motion.p>
          )}
          {stage >= 2 && (
            <motion.p
              key="l2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6 }}
              className="text-[17px] font-semibold text-cloud text-balance"
            >
              {b.lines[1]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+28px)] flex justify-center">
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <PaperButton onClick={() => go("gift")}>
                <span className="inline-flex items-center gap-2">
                  {b.cta}
                  <GiftIcon />
                </span>
              </PaperButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="10" width="16" height="10" rx="1.5" />
      <rect x="3" y="7" width="18" height="4" rx="1" />
      <path d="M12 7v13M12 7c-2-4-6-4-6-1.5S10 7 12 7zm0 0c2-4 6-4 6-1.5S14 7 12 7z" />
    </svg>
  );
}
