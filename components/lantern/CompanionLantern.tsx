"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useStory } from "@/components/story/StoryContext";
import { LanternArt } from "./LanternArt";

/**
 * Chiếc đèn MyMy đã chọn, cầm trên một cán tre thò ra từ góc dưới màn hình —
 * như đang tự tay cầm đèn đi dạo. Mỗi lần chạm, đèn đung đưa một chút.
 */
export function CompanionLantern() {
  const { lantern, hasStarLantern } = useStory();
  const swing = useSpring(0, { stiffness: 40, damping: 4, mass: 1.2 });
  const swing2 = useSpring(0, { stiffness: 55, damping: 5 });

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const dir = e.clientX > window.innerWidth / 2 ? 1 : -1;
      swing.set(swing.get() + dir * 9);
      swing2.set(swing2.get() - dir * 12);
      window.setTimeout(() => {
        swing.set(0);
        swing2.set(0);
      }, 120);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [swing, swing2]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 z-10 aspect-[200/260] w-[min(44vw,230px)]"
      initial={{ y: "40%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "40%", opacity: 0 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ánh đèn hắt lên cảnh */}
      <div
        className="anim-flicker absolute -left-[30%] bottom-[10%] size-[150%] rounded-full mix-blend-screen"
        style={{ background: `radial-gradient(closest-side, ${lantern.glow}40, ${lantern.glow}10 55%, transparent)` }}
      />
      {/* cán tre */}
      <svg viewBox="0 0 200 260" className="absolute inset-0 size-full" preserveAspectRatio="none">
        <path d="M-6 268 C 40 200, 80 120, 128 62" stroke="#3a2a12" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M-4 262 C 42 196, 81 118, 127 63" stroke="#6b4e22" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        {[0.3, 0.55, 0.78].map((t) => (
          <circle key={t} cx={-6 + 134 * t} cy={268 - 206 * t} r="3.6" fill="#2a1d0c" />
        ))}
      </svg>
      {/* đèn treo ở đầu cán */}
      <motion.div className="absolute left-[43%] top-[23.8%] w-[42%]" style={{ rotate: swing, originX: 0.5, originY: 0 }}>
        <div className="anim-sway-small origin-top">
          <LanternArt id={lantern.id} className="w-full translate-y-[28%]" />
        </div>
      </motion.div>
      {hasStarLantern && (
        <motion.div className="absolute left-[21.8%] top-[59.5%] w-[24%]" style={{ rotate: swing2, originX: 0.5, originY: 0 }}>
          <div className="anim-sway origin-top">
            <LanternArt id="star" className="w-full translate-y-[28%]" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
