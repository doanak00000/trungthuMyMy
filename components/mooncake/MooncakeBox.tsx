"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { messages } from "@/data/messages";
import { getAudio } from "@/lib/audio";
import { Mooncake, type CakePattern } from "./Mooncake";
import { Heart } from "@/components/ui/Heart";
import { WithHearts } from "@/components/ui/WithHearts";

const PATTERNS: CakePattern[] = ["flower", "lotus", "egg", "heart"];

/** Hộp bánh 4 ngăn. Ba vị thường cho vui, vị “LuLu” thì bẻ đôi ra mới thấy nhân. */
export function MooncakeBox() {
  const m = messages.mooncake;
  const [chosen, setChosen] = useState<number | null>(null);
  const flavor = chosen === null ? null : m.flavors[chosen];
  const isSpecial = !!flavor && "special" in flavor && flavor.special;

  const choose = (i: number) => {
    setChosen(i);
    const f = m.flavors[i];
    if ("special" in f && f.special) {
      getAudio().thud();
      window.setTimeout(() => getAudio().bell(0.9), 350);
    } else {
      getAudio().bell(1.3);
    }
  };

  return (
    <div>
      <p className="text-[15px] text-mist">{m.sub}</p>

      {/* hộp bánh đỏ viền vàng */}
      <div
        className="mt-5 rounded-[14px] p-3"
        style={{
          background: "linear-gradient(160deg, #b8200f, #8a1a0c)",
          boxShadow: "inset 0 0 0 2px #ffc45c, inset 0 0 0 6px #8a1a0c, inset 0 0 0 7px rgba(255,196,92,0.5), 0 18px 40px -12px rgba(0,0,0,0.6)",
        }}
      >
        <div className="grid grid-cols-2 gap-2.5">
          {m.flavors.map((f, i) => {
            const active = chosen === i;
            const special = "special" in f && f.special;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={active}
                className="flex flex-col items-center rounded-[10px] bg-[#5a0e06]/70 px-2 pb-2.5 pt-3 transition-colors hover:bg-[#6a1208]/80"
              >
                <motion.div
                  key={active ? "on" : "off"}
                  animate={active && !special ? { rotate: [0, -8, 8, -4, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-[86%] max-w-[120px]"
                >
                  <Mooncake pattern={PATTERNS[i]} split={active && special} className="w-full" />
                </motion.div>
                <span className={`mt-1.5 text-[14px] font-bold ${special ? "text-[#ffd0dc]" : "text-[#ffe3a1]"}`}><WithHearts text={f.name} /></span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 min-h-[120px]" aria-live="polite">
        <AnimatePresence mode="wait">
          {flavor && !isSpecial && (
            <motion.p
              key={flavor.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[16px] leading-relaxed text-cloud/90"
            >
              {flavor.line}
            </motion.p>
          )}
          {isSpecial && (
            <motion.div
              key="special"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              <p className="text-[15px] text-mist">{m.specialReveal.before}</p>
              <p className="mt-1 font-hand text-[21px] leading-[1.75] text-[#ffc2d1]">
                {m.specialReveal.after} <Heart className="inline size-5 -translate-y-0.5" />
              </p>
              <p className="mt-2 text-[13px] text-mist/80">{m.specialReveal.note}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
