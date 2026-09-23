"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { lanterns, type LanternId } from "@/data/festival";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { PaperButton } from "@/components/ui/PaperButton";
import { getAudio } from "@/lib/audio";
import { LanternArt } from "./LanternArt";

const ROWS: LanternId[][] = [
  ["star", "rabbit", "moon"],
  ["flower", "lulu"],
];

/** Màn 3 — năm chiếc đèn treo trên hai sợi dây, chọn một chiếc để cầm theo cả tối. */
export function LanternPicker() {
  const { go, chooseLantern } = useStory();
  const [picked, setPicked] = useState<LanternId | null>(null);
  const [nudge, setNudge] = useState(0);
  const m = messages.lantern;
  const current = lanterns.find((l) => l.id === picked);

  const pick = (id: LanternId) => {
    setPicked(id);
    setNudge((n) => n + 1);
    chooseLantern(id);
    getAudio().unlock();
    getAudio().bell(id === "lulu" ? 0.84 : 1.12);
  };

  return (
    <motion.section
      className="no-scrollbar absolute inset-0 flex flex-col items-center overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+22px)] pt-[calc(env(safe-area-inset-top)+11svh)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <header className="text-center">
        <h1 className="text-[26px] font-extrabold text-cloud text-balance">{m.heading}</h1>
        <p className="mt-1.5 text-[15px] text-mist">{m.sub}</p>
      </header>

      <div className="mt-3 w-full max-w-[440px]">
        {ROWS.map((row, r) => (
          <div key={r} className="relative mt-2 pt-5">
            {/* sợi dây */}
            <svg aria-hidden viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-6 w-full">
              <path d="M0 1 Q 50 9 100 1" stroke="#2c2350" strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="flex justify-center gap-2">
              {row.map((id, i) => {
                const l = lanterns.find((x) => x.id === id)!;
                const active = picked === id;
                const dim = picked !== null && !active;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pick(id)}
                    aria-pressed={active}
                    aria-label={l.name}
                    className="group relative flex w-[27%] max-w-[min(116px,11svh)] flex-col items-center pb-1 pt-1 transition-opacity duration-500"
                    style={{ opacity: dim ? 0.45 : 1, marginTop: i === 1 && row.length === 3 ? 10 : 0 }}
                  >
                    <motion.div
                      key={active ? `a-${nudge}` : "idle"}
                      className="w-full origin-top"
                      initial={active ? { rotate: -12 } : false}
                      animate={{ rotate: 0, scale: active ? 1.12 : 1 }}
                      transition={active ? { type: "spring", damping: 5, stiffness: 60 } : { duration: 0.4 }}
                    >
                      <LanternArt
                        id={id}
                        className={`w-full transition-[filter] duration-500 group-active:scale-95 ${active ? "" : "anim-sway-small"}`}
                        halo={!dim}
                      />
                    </motion.div>
                    <span className={`mt-1 whitespace-nowrap text-[12px] font-semibold ${active ? "text-glow" : "text-cloud/80"}`}>{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex min-h-[112px] shrink-0 flex-col items-center justify-end gap-3 pt-3 text-center">
        <AnimatePresence mode="wait">
          {current && (
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45 }}
              className="font-hand text-[19px] leading-[1.7] text-moon"
            >
              {m.picked}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.div animate={{ opacity: current ? 1 : 0, y: current ? 0 : 10 }} transition={{ duration: 0.5 }}>
          <PaperButton arrow disabled={!current} onClick={() => go("festival")} tabIndex={current ? 0 : -1}>
            {m.cta}
          </PaperButton>
        </motion.div>
      </div>
    </motion.section>
  );
}
