"use client";

import { motion } from "framer-motion";
import { games } from "@/data/games";

/** Phủ lên khung trò chơi khi đã trúng thưởng hoặc hết lượt. Đặt trong một khung `relative`. */
export function GameLock({ reason }: { reason: "won" | "out" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0a0d2c]/80 px-6 text-center"
    >
      <svg viewBox="0 0 24 24" className="size-9 text-glow" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {reason === "won" ? (
          <>
            <path d="M4 10h16v10H4z" />
            <path d="M2.5 7h19v3h-19zM12 7v13M12 7c-2-4-6-4-6-1.5S10 7 12 7zm0 0c2-4 6-4 6-1.5S14 7 12 7z" />
          </>
        ) : (
          <>
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </>
        )}
      </svg>
      <p className="text-[16px] font-bold leading-snug text-cloud text-balance">{games.locked[reason]}</p>
    </motion.div>
  );
}
