"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { festivalConfig } from "@/data/festival";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { getAudio } from "@/lib/audio";

type Fly = { id: number; path: { x: number[]; y: number[] }; duration: number; delay: number };

function makeFly(id: number, band: [number, number]): Fly {
  const points = 5;
  const x: number[] = [];
  const y: number[] = [];
  let px = 6 + Math.random() * 88;
  let py = band[0] + Math.random() * (band[1] - band[0]);
  for (let i = 0; i < points; i++) {
    x.push(px);
    y.push(py);
    px = Math.max(4, Math.min(96, px + (Math.random() - 0.5) * 26));
    py = Math.max(band[0], Math.min(band[1], py + (Math.random() - 0.5) * 14));
  }
  x.push(x[0]);
  y.push(y[0]);
  return { id, path: { x, y }, duration: 16 + Math.random() * 14, delay: Math.random() * 3 };
}

/**
 * Đom đóm bay lượn. Chạm vào để "bắt" — đủ số thì mở một lời nhắn bí mật.
 * Không bắt cũng chẳng sao, đây chỉ là trò phụ.
 */
export function Fireflies({ count = 9, band = [34, 86] as [number, number] }) {
  const { fireflies, catchFirefly, setOverlay } = useStory();
  const nextId = useRef(count);
  const [flies, setFlies] = useState<Fly[]>([]);
  const [flash, setFlash] = useState<{ x: number; y: number; key: number } | null>(null);
  const [toast, setToast] = useState<number | null>(null);
  const unlocked = fireflies >= festivalConfig.firefliesToCatch;

  useEffect(() => {
    setFlies(Array.from({ length: count }, (_, i) => makeFly(i, band)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (toast === null) return;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onCatch = (fly: Fly, e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setFlash({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, key: Date.now() });
    getAudio().chime();
    setFlies((all) => all.filter((f) => f.id !== fly.id));
    window.setTimeout(() => {
      setFlies((all) => [...all, makeFly(nextId.current++, band)]);
    }, 5000);
    if (unlocked) return;
    const n = catchFirefly();
    if (n >= festivalConfig.firefliesToCatch) {
      window.setTimeout(() => setOverlay("firefly"), 700);
    } else if (n >= 2) {
      setToast(n);
    }
  };

  const flyNodes = useMemo(
    () =>
      flies.map((fly) => (
        <motion.button
          key={fly.id}
          type="button"
          aria-label="Đom đóm"
          onPointerDown={(e) => onCatch(fly, e)}
          className="pointer-events-auto absolute -left-[22px] -top-[22px] grid size-11 place-items-center"
          initial={{ x: `${fly.path.x[0]}vw`, y: `${fly.path.y[0]}vh`, opacity: 0 }}
          animate={{
            x: fly.path.x.map((v) => `${v}vw`),
            y: fly.path.y.map((v) => `${v}vh`),
            opacity: 1,
          }}
          exit={{ opacity: 0, scale: 2.2, transition: { duration: 0.4 } }}
          transition={{
            x: { duration: fly.duration, repeat: Infinity, ease: "easeInOut", delay: fly.delay },
            y: { duration: fly.duration, repeat: Infinity, ease: "easeInOut", delay: fly.delay },
            opacity: { duration: 2 },
          }}
        >
          <span
            className="anim-flicker block size-[6px] rounded-full bg-[#eaffa0]"
            style={{
              boxShadow: "0 0 8px 3px rgba(214,255,120,0.55), 0 0 22px 8px rgba(190,255,110,0.18)",
              animationDuration: `${1.6 + (fly.id % 5) * 0.5}s`,
            }}
          />
        </motion.button>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flies, unlocked],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <AnimatePresence>{flyNodes}</AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.span
            key={flash.key}
            className="absolute size-3 rounded-full bg-[#f2ffc2]"
            style={{ left: flash.x - 6, top: flash.y - 6 }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => setFlash(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast !== null && (
          <motion.p
            key="toast"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-[calc(env(safe-area-inset-top)+64px)] -translate-x-1/2 rounded-full bg-shadow/70 px-3 py-1 text-xs font-medium tracking-wide text-[#e6ffb0]"
          >
            {messages.easterEggs.firefly.counter(toast, festivalConfig.firefliesToCatch)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
