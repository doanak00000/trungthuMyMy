"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { PaperButton } from "@/components/ui/PaperButton";
import { LanternArt } from "@/components/lantern/LanternArt";
import { getAudio } from "@/lib/audio";
import { WithHearts } from "@/components/ui/WithHearts";

const BARCODE = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1];

/** Màn 2 — tấm vé giấy vàng, đóng mộc đỏ “Đã giữ chỗ” rồi bay lên. */
export function Ticket() {
  const { go } = useStory();
  const t = messages.ticket;
  const [stamped, setStamped] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    void controls.start({ y: 0, rotate: -1.5, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } });
  }, [controls]);

  const receive = async () => {
    if (stamped) return;
    setStamped(true);
    window.setTimeout(() => getAudio().thud(), 380);
    await new Promise((r) => window.setTimeout(r, 1300));
    await controls.start({
      y: "-110svh",
      rotate: -8,
      scale: 0.7,
      transition: { duration: 1.4, ease: [0.55, 0, 0.3, 1] },
    });
    go("lantern");
  };

  return (
    <motion.section
      className="no-scrollbar absolute inset-0 flex flex-col items-center justify-center-safe gap-7 overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[calc(env(safe-area-inset-top)+48px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <motion.article
        animate={controls}
        initial={{ y: 40, rotate: 2, opacity: 0 }}
        className="relative w-full max-w-[340px] text-[#4a1606]"
        style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.45)) drop-shadow(0 0 60px rgba(255,170,60,0.25))" }}
      >
        {/* thân vé */}
        <div
          className="relative overflow-hidden rounded-t-[18px] px-6 pb-6 pt-5"
          style={{ background: "linear-gradient(170deg, #ffd98a 0%, #ffbf55 70%, #ffae45 100%)" }}
        >
          <div className="-mx-6 -mt-5 mb-5 flex items-center gap-3 bg-vermilion px-6 py-3 text-[#ffe3a1]">
            <LanternArt id="star" string={false} halo={false} className="-my-2 w-8 shrink-0" />
            <div>
              <h1 className="text-[15px] font-extrabold uppercase tracking-[0.12em]">{t.heading}</h1>
              <p className="text-xs font-medium opacity-80">{t.serial}</p>
            </div>
          </div>

          <dl className="space-y-3.5">
            {t.fields.map((f) => (
              <div key={f.label}>
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a3510]/80">{f.label}</dt>
                <dd className="text-[19px] font-extrabold leading-tight"><WithHearts text={f.value} /></dd>
              </div>
            ))}
          </dl>

          {/* mộc đỏ */}
          <AnimatePresence>
            {stamped && (
              <motion.div
                aria-hidden
                className="absolute bottom-5 right-4 grid size-[104px] place-items-center rounded-full border-[3px] border-[#c8261a] text-center text-[#c8261a]"
                style={{ mixBlendMode: "multiply" }}
                initial={{ scale: 2.4, opacity: 0, rotate: 8 }}
                animate={{ scale: 1, opacity: 0.88, rotate: -14 }}
                transition={{ type: "spring", damping: 14, stiffness: 260, delay: 0.25 }}
              >
                <div className="rounded-full border border-[#c8261a] px-2 py-4">
                  <p className="text-[12px] font-extrabold uppercase leading-tight tracking-[0.08em]">{t.stamp}</p>
                  <p className="mt-0.5 text-[10px] font-bold">15 · 8</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* đường xé */}
        <div
          className="relative h-5"
          style={{
            background:
              "radial-gradient(circle at 0 50%, transparent 10px, #ffae45 10.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 10px, #ffae45 10.5px) right / 51% 100% no-repeat",
          }}
        >
          <span className="absolute inset-x-4 top-1/2 border-t-2 border-dashed border-[#8a3510]/35" />
        </div>

        {/* cuống vé */}
        <div
          className="flex items-end justify-between gap-4 rounded-b-[18px] px-6 pb-5 pt-2"
          style={{ background: "linear-gradient(180deg, #ffae45 0%, #ff9f3a 100%)" }}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a3510]/80">{t.statusLabel}</p>
            <p className="text-[17px] font-extrabold">{t.status}</p>
          </div>
          <div aria-hidden className="flex h-9 items-stretch gap-[2px] opacity-70">
            {BARCODE.map((w, i) => (
              <span key={i} className="bg-[#4a1606]" style={{ width: w }} />
            ))}
          </div>
        </div>
      </motion.article>

      <motion.div animate={{ opacity: stamped ? 0 : 1 }} transition={{ duration: 0.4 }}>
        <PaperButton onClick={receive} disabled={stamped}>
          {t.cta}
        </PaperButton>
      </motion.div>
    </motion.section>
  );
}
