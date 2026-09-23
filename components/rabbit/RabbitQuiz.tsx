"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { quiz, quizReward } from "@/data/quiz";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { PaperButton } from "@/components/ui/PaperButton";
import { LanternArt } from "@/components/lantern/LanternArt";
import { getAudio } from "@/lib/audio";
import { MoonRabbit } from "./MoonRabbit";
import { WithHearts } from "@/components/ui/WithHearts";

const LETTERS = ["A", "B", "C", "D", "E"];

/** Thỏ Ngọc đố vui 3 câu. Sai thì Thỏ nghiêng đầu gợi ý, chọn lại thoải mái. */
export function RabbitQuiz() {
  const { awardStarLantern, hasStarLantern } = useStory();
  const [step, setStep] = useState(hasStarLantern ? quiz.length : -1);
  const [wrong, setWrong] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const done = step >= quiz.length;
  const q = step >= 0 && !done ? quiz[step] : null;

  useEffect(() => {
    if (done && !hasStarLantern) {
      awardStarLantern();
      getAudio().bell(1);
      window.setTimeout(() => getAudio().bell(1.5), 180);
    }
  }, [done, hasStarLantern, awardStarLantern]);

  const answer = (i: number) => {
    if (!q || right !== null) return;
    if (i === q.answer) {
      setRight(i);
      setWrong(null);
      getAudio().chime();
      window.setTimeout(() => {
        setRight(null);
        setStep((s) => s + 1);
      }, 1100);
    } else {
      setWrong(i);
      getAudio().thud();
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <MoonRabbit className="w-32" happy={done} puzzled={wrong !== null} key={done ? "happy" : `q-${step}`} />
        {done && (
          <motion.div
            className="absolute -right-10 top-2 w-14"
            initial={{ opacity: 0, y: 20, rotate: -20 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", damping: 8 }}
          >
            <LanternArt id="star" string={false} className="w-full" />
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            <p className="text-[16px] leading-relaxed text-cloud/90 text-balance">{messages.rabbit.greeting}</p>
            <PaperButton className="mt-6" onClick={() => setStep(0)}>
              {messages.rabbit.start}
            </PaperButton>
          </motion.div>
        )}

        {q && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="mt-3 w-full"
          >
            <div className="flex justify-center gap-1.5" aria-label={`Câu ${step + 1} trên ${quiz.length}`}>
              {quiz.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? "w-6 bg-glow" : "w-1.5 bg-cloud/25"}`} />
              ))}
            </div>
            <h3 className="mt-3 text-[20px] font-extrabold leading-snug text-cloud text-balance">{q.question}</h3>
            <div className="mt-5 grid gap-2.5">
              {q.options.map((opt, i) => {
                const isRight = right === i;
                const isWrong = wrong === i;
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    onClick={() => answer(i)}
                    animate={isWrong ? { x: [0, -6, 6, -3, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex min-h-[52px] items-center gap-3 rounded-[12px] px-4 text-left text-[16px] font-semibold transition-colors ${
                      isRight
                        ? "bg-jade/90 text-[#04201a]"
                        : isWrong
                          ? "bg-[#2a1f4a] text-cloud/50"
                          : "bg-indigo/70 text-cloud hover:bg-indigo"
                    }`}
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-extrabold ${
                        isRight ? "bg-[#04201a]/20" : "bg-glow/15 text-glow"
                      }`}
                    >
                      {LETTERS[i]}
                    </span>
                    <WithHearts text={opt} />
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-4 min-h-6 text-[15px]" aria-live="polite">
              {wrong !== null && <p className="text-mist">{q.hint}</p>}
              {right !== null && <p className="font-semibold text-jade">{q.cheer}</p>}
            </div>
          </motion.div>
        )}

        {done && (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
            <p className="text-[20px] font-extrabold text-glow text-balance">{quizReward.title}</p>
            <p className="mt-2 text-[15px] text-cloud/80">{quizReward.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
