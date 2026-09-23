"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { PaperButton } from "@/components/ui/PaperButton";
import { FloatingLanterns } from "@/components/lantern/FloatingLanterns";
import { Heart } from "@/components/ui/Heart";

// Đèn bay sát hai mép, không đè lên chữ
const INTRO_LANES = [3, 86, 9, 80, 1, 90];

// Nhịp xuất hiện (ms): trăng → sao → đèn → từng câu → lời mời → nút
const TIMELINE = [600, 2000, 3000, 3600, 5600, 8000, 10400, 11800];

/**
 * Màn 1 — gần như tối hẳn, trăng lên chậm, sao hiện dần, vài chiếc đèn trôi lên.
 * Chạm vào màn hình để tua nhanh cho ai sốt ruột.
 */
export function MoonIntro({ stage, setStage }: { stage: number; setStage: (n: number) => void }) {
  const { go } = useStory();
  const { lines, reveal, cta } = messages.intro;
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;
    const timers = TIMELINE.map((ms, i) => window.setTimeout(() => setStage(i + 1), ms));
    return () => timers.forEach(window.clearTimeout);
  }, [setStage, skipped]);

  const skip = () => {
    if (stage >= TIMELINE.length) return;
    setSkipped(true);
    setStage(TIMELINE.length);
  };

  const lineVisible = (i: number) => stage >= 4 + i;

  return (
    <motion.section
      className="relative flex min-h-dvh flex-col items-center justify-end px-6 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-[46vh]"
      onClick={skip}
      exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 1.1 } }}
    >
      {stage >= 3 && <FloatingLanterns count={6} lanes={INTRO_LANES} />}

      <div className="relative w-full max-w-[26rem] text-center">
        <p
          className="font-hand text-[34px] leading-[1.6] text-moon transition-all duration-[1400ms] ease-out"
          style={{ opacity: lineVisible(0) ? 1 : 0, transform: `translateY(${lineVisible(0) ? 0 : 10}px)` }}
        >
          {lines[0]}
        </p>
        <div className="mt-4 space-y-3 text-[17px] leading-relaxed text-cloud/85 text-balance">
          {lines.slice(1).map((line, i) => (
            <p
              key={line}
              className="transition-all duration-[1400ms] ease-out"
              style={{ opacity: lineVisible(i + 1) ? 1 : 0, transform: `translateY(${lineVisible(i + 1) ? 0 : 10}px)` }}
            >
              {line}
            </p>
          ))}
        </div>

        <AnimatePresence>
          {stage >= 7 && (
            <motion.p
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 text-[22px] font-extrabold leading-snug text-cloud text-balance [text-shadow:0_0_24px_rgba(255,190,90,0.45)]"
            >
              {reveal} <Heart className="inline size-5 -translate-y-0.5 align-middle" />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-10 h-14">
        <AnimatePresence>
          {stage >= 8 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <PaperButton
                arrow
                onClick={(e) => {
                  e.stopPropagation();
                  go("ticket");
                }}
              >
                {cta}
              </PaperButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
