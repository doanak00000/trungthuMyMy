"use client";

import { motion } from "framer-motion";

/** Đèn trời bay chậm ở phía xa, vòng lặp nhẹ nhàng. */
export function SkyLantern({ left, delay, duration, size }: { left: number; delay: number; duration: number; size: number }) {
  return (
    <motion.div
      className="absolute bottom-[30%]"
      style={{ left: `${left}%`, width: size }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: "-60dvh", opacity: [0, 0.9, 0.9, 0], x: [0, 8, -6, 4] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear", times: [0, 0.15, 0.8, 1] }}
    >
      <svg viewBox="0 0 24 32" className="w-full" overflow="visible">
        <circle cx="12" cy="16" r="20" fill="#ffb54a" opacity="0.18" />
        <path d="M5 4 h14 l-2 22 h-10 z" fill="#ffa640" />
        <path d="M8 6 h8 l-1 16 h-6 z" fill="#ffe6a4" opacity="0.7" />
      </svg>
    </motion.div>
  );
}
