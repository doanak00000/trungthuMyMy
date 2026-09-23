"use client";

import { motion } from "framer-motion";

/** Hộp quà đỏ nơ vàng. Khi `open`, nắp bật lên và nghiêng sang một bên. viewBox 200 × 200 */
export function GiftBox({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full" aria-hidden overflow="visible">
      <defs>
        <linearGradient id="gift-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ef5a3a" />
          <stop offset="1" stopColor="#a8190c" />
        </linearGradient>
        <radialGradient id="gift-light">
          <stop offset="0" stopColor="#fff2c4" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ffc45c" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffc45c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ánh sáng từ trong hộp */}
      <motion.ellipse
        cx="100"
        cy="92"
        rx="90"
        fill="url(#gift-light)"
        initial={{ ry: 0, opacity: 0, cy: 92 }}
        animate={open ? { ry: 120, opacity: 1, cy: 40 } : { ry: 0, opacity: 0, cy: 92 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      {/* thân hộp */}
      <rect x="36" y="92" width="128" height="96" rx="6" fill="url(#gift-body)" />
      <rect x="92" y="92" width="16" height="96" fill="#ffc45c" />
      <rect x="36" y="92" width="128" height="10" fill="#000" opacity="0.18" />

      {/* nắp */}
      <motion.g
        style={{ originX: "164px", originY: "92px" }}
        animate={open ? { rotate: 38, y: -54, x: 26, opacity: [1, 1, 0.9] } : { rotate: 0, y: 0, x: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.9, 0.3, 1] }}
      >
        <rect x="28" y="70" width="144" height="26" rx="5" fill="#d8301a" />
        <rect x="92" y="70" width="16" height="26" fill="#ffd47a" />
        {/* nơ */}
        <path d="M100 70 C 84 44, 58 48, 66 64 C 72 74, 92 72, 100 70 Z" fill="#ffc45c" />
        <path d="M100 70 C 116 44, 142 48, 134 64 C 128 74, 108 72, 100 70 Z" fill="#ffc45c" />
        <path d="M100 70 C 90 58, 76 58, 78 64" stroke="#c98a1e" strokeWidth="2" fill="none" />
        <circle cx="100" cy="70" r="7" fill="#ffd47a" />
      </motion.g>
    </svg>
  );
}
