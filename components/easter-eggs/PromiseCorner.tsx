"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { promises } from "@/data/festival";
import { messages } from "@/data/messages";
import { getAudio } from "@/lib/audio";

/**
 * Góc nhỏ sau mặt trăng: chưa có ảnh chung, nên là những lời hẹn cho lần gặp đầu tiên.
 * Chạm vào từng điều để đóng mộc “Đã hứa”. Cuối cùng là một khung ảnh còn trống.
 */
export function PromiseCorner() {
  const m = messages.easterEggs.moon;
  const [stamped, setStamped] = useState<number[]>([]);

  const stamp = (i: number) => {
    if (stamped.includes(i)) return;
    setStamped((s) => [...s, i]);
    getAudio().thud();
  };

  return (
    <div>
      <p className="text-[15px] leading-relaxed text-mist text-pretty">{m.sub}</p>
      <p className="mt-2 text-[14px] text-cloud/70">{m.tapHint}.</p>

      <ol className="mt-3 space-y-2.5">
        {promises.map((text, i) => {
          const done = stamped.includes(i);
          return (
            <li key={text}>
              <button
                type="button"
                onClick={() => stamp(i)}
                aria-pressed={done}
                className="relative flex min-h-[56px] w-full items-center gap-3 overflow-hidden rounded-[10px] bg-[#fff1cf] py-3 pl-4 pr-24 text-left text-[15.5px] font-semibold leading-snug text-[#4a1606]"
              >
                <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-vermilion/15 text-[13px] font-extrabold text-vermilion">
                  {i + 1}
                </span>
                {text}
                <AnimatePresence>
                  {done && (
                    <motion.span
                      aria-hidden
                      className="absolute right-3 top-1/2 grid size-[62px] -translate-y-1/2 place-items-center rounded-full border-2 border-[#c8261a] text-center text-[11px] font-extrabold uppercase leading-tight text-[#c8261a]"
                      style={{ mixBlendMode: "multiply" }}
                      initial={{ scale: 2, opacity: 0, rotate: 10 }}
                      animate={{ scale: 1, opacity: 0.85, rotate: -12 }}
                      transition={{ type: "spring", damping: 14, stiffness: 280 }}
                    >
                      {m.promiseStamp}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ol>

      {/* khung ảnh còn trống */}
      <figure className="mx-auto mt-7 w-[64%] max-w-[240px] rotate-[-2deg] bg-[#fdf8ee] p-2.5 pb-3 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.7)]">
        <div className="grid aspect-[4/5] w-full place-items-center border-2 border-dashed border-[#b9b0d8] bg-[#eee9f7]">
          <svg viewBox="0 0 24 24" className="size-10 text-[#9d93c4]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <circle cx="12" cy="13.5" r="3.5" />
            <path d="M8 7l1.5-2.5h5L16 7" />
          </svg>
        </div>
        <figcaption className="mt-2 px-1 text-center font-hand text-[14px] leading-[1.8] text-ink-violet">
          {m.photoSlot}
          <span className="block font-sans text-[12px] text-[#7a70a8]">{m.photoSlotNote}</span>
        </figcaption>
      </figure>
    </div>
  );
}
