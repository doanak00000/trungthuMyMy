"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { gifts } from "@/data/festival";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { PaperButton } from "@/components/ui/PaperButton";
import { Letter } from "@/components/letter/Letter";
import { getAudio } from "@/lib/audio";
import { GiftBox } from "./GiftBox";
import { FlowerGift } from "./FlowerGift";

/** idle → mở nắp → từng bó hoa (0, 1, …) → lá thư */
type Phase = "idle" | "opening" | number | "letter";

/** Màn 7 — hộp quà phát sáng. Mở ra lần lượt: tulip, hướng dương, rồi lá thư của LuLu. */
export function GiftScene() {
  const { setOverlay, restart } = useStory();
  const g = messages.gift;
  const [phase, setPhase] = useState<Phase>("idle");
  const [finished, setFinished] = useState(false);
  const onDone = useCallback(() => setFinished(true), []);
  const total = gifts.length + 1; // + lá thư

  useEffect(() => {
    getAudio().setMood("gift");
  }, []);

  const open = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    getAudio().bell(0.75);
    window.setTimeout(() => getAudio().bell(1), 400);
    window.setTimeout(() => getAudio().bell(1.5), 800);
    window.setTimeout(() => setPhase(gifts.length ? 0 : "letter"), 1900);
  };

  const next = () => {
    if (typeof phase !== "number") return;
    getAudio().bell(1.2);
    setPhase(phase + 1 < gifts.length ? phase + 1 : "letter");
  };

  const boxVisible = phase === "idle" || phase === "opening";
  const step = typeof phase === "number" ? phase + 1 : phase === "letter" ? total : 0;

  return (
    <motion.section
      className="thin-scrollbar fixed inset-0 overflow-y-auto overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4 }}
    >
      {/* màn tối lại một chút, rồi trăng sáng bừng */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(circle at 50% 22vh, transparent 0, transparent min(34vmin,200px), #070a26 min(52vmin,300px))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "idle" ? 0.35 : 0.55 }}
        transition={{ duration: 1.6 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-[-10vh] size-[140vmin] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,230,164,0.35), rgba(255,196,92,0.08) 55%, transparent)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "idle" ? 0 : 1 }}
        transition={{ duration: 2.4 }}
      />

      <div className="relative flex min-h-dvh flex-col items-center justify-center px-5 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+64px)]">
        {step > 0 && (
          <p className="absolute left-1/2 top-[calc(env(safe-area-inset-top)+22px)] -translate-x-1/2 rounded-full bg-shadow/55 px-3 py-1 text-[12px] font-semibold tracking-wide text-cloud/80">
            {g.counter(step, total)}
          </p>
        )}

        <AnimatePresence mode="wait">
          {boxVisible && (
            <motion.div
              key="box"
              className="mt-[22vh] flex flex-col items-center"
              exit={{ opacity: 0, y: 30, scale: 0.9, transition: { duration: 0.6 } }}
            >
              <motion.button
                type="button"
                onClick={open}
                aria-label={g.tapHint}
                className="relative isolate w-[min(56vw,240px)]"
                animate={phase === "idle" ? { y: [0, -8, 0] } : { y: 0, scale: 1.06 }}
                transition={phase === "idle" ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
              >
                <span
                  aria-hidden
                  className="anim-flicker absolute -inset-[30%] -z-10 rounded-full"
                  style={{ background: "radial-gradient(closest-side, rgba(255,180,80,0.45), transparent)" }}
                />
                <GiftBox open={phase === "opening"} />
              </motion.button>
              <motion.p animate={{ opacity: phase === "idle" ? 1 : 0 }} className="mt-6 text-[15px] font-medium text-cloud/80">
                {g.tapHint}
              </motion.p>
            </motion.div>
          )}

          {typeof phase === "number" && (
            <motion.div
              key={`gift-${phase}`}
              className="flex w-full flex-col items-center"
              initial={{ opacity: 0, y: 70, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, rotate: -6, transition: { duration: 0.5 } }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <FlowerGift gift={gifts[phase]} tilt={phase % 2 ? 2.5 : -2.5} />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} className="mt-7">
                <PaperButton arrow onClick={next}>
                  {phase + 1 < gifts.length ? g.next : g.openLetter}
                </PaperButton>
              </motion.div>
            </motion.div>
          )}

          {phase === "letter" && (
            <motion.div key="letter" className="relative z-10 w-full py-6">
              <Letter onDone={onDone} />
              <AnimatePresence>
                {finished && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-10 flex flex-col items-center gap-3"
                  >
                    <PaperButton onClick={() => setOverlay("promises")}>{messages.letter.memories}</PaperButton>
                    <PaperButton tone="quiet" onClick={restart}>
                      {messages.letter.replay}
                    </PaperButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
