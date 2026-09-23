"use client";

import { motion } from "framer-motion";

/** Thỏ Ngọc ngồi, ôm một chiếc bánh nướng nhỏ. viewBox 160 × 180. `happy` cho thỏ nhảy mừng. */
export function MoonRabbit({ className, happy = false, puzzled = false }: { className?: string; happy?: boolean; puzzled?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 160 180"
      className={className}
      aria-hidden
      overflow="visible"
      animate={
        happy
          ? { y: [0, -26, 0, -16, 0], rotate: [0, -4, 0, 4, 0] }
          : puzzled
            ? { rotate: [0, -8, -8, 0] }
            : { y: 0, rotate: 0 }
      }
      transition={happy ? { duration: 1.3, ease: "easeOut" } : { duration: 0.9 }}
      style={{ originX: 0.5, originY: 1 }}
    >
      <defs>
        <radialGradient id="rab-glow">
          <stop offset="0" stopColor="#e6dcff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#e6dcff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rab-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#e6ddf5" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="110" rx="90" ry="80" fill="url(#rab-glow)" />
      <ellipse cx="80" cy="172" rx="46" ry="6" fill="#050718" opacity="0.5" />

      {/* tai */}
      <g className="anim-ear">
        <path d="M58 64 C 44 34, 44 6, 54 2 C 66 2, 70 34, 68 62 Z" fill="url(#rab-fur)" />
        <path d="M58 58 C 50 36, 50 14, 55 9 C 61 12, 63 36, 63 56 Z" fill="#ffb8cc" />
      </g>
      <g style={{ transformOrigin: "96px 62px", transform: puzzled ? "rotate(28deg)" : "rotate(12deg)", transition: "transform .5s" }}>
        <path d="M90 64 C 90 34, 98 8, 110 6 C 120 10, 112 38, 100 64 Z" fill="url(#rab-fur)" />
        <path d="M94 58 C 95 38, 101 18, 108 14 C 112 20, 106 40, 99 58 Z" fill="#ffb8cc" />
      </g>

      {/* thân + đầu */}
      <path d="M40 170 C 30 140, 36 110, 56 98 C 70 90, 94 90, 108 100 C 128 112, 132 146, 120 170 Z" fill="url(#rab-fur)" />
      <ellipse cx="80" cy="82" rx="32" ry="28" fill="url(#rab-fur)" />
      {/* mắt, má, mũi */}
      <g>
        {happy ? (
          <>
            <path d="M62 80 q5 -6 10 0" stroke="#3a2140" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M88 80 q5 -6 10 0" stroke="#3a2140" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="67" cy="80" rx="3.4" ry="4.2" fill="#3a2140" />
            <ellipse cx="93" cy="80" rx="3.4" ry="4.2" fill="#3a2140" />
            <circle cx="68.2" cy="78.6" r="1.1" fill="#fff" />
            <circle cx="94.2" cy="78.6" r="1.1" fill="#fff" />
          </>
        )}
        <ellipse cx="58" cy="90" rx="6" ry="3.5" fill="#ffadc4" opacity="0.7" />
        <ellipse cx="102" cy="90" rx="6" ry="3.5" fill="#ffadc4" opacity="0.7" />
        <path d="M77 88 q3 3 6 0" fill="#ff8fab" />
        <path d="M80 91 v3 M80 94 q-4 3 -7 0 M80 94 q4 3 7 0" stroke="#3a2140" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>

      {/* ôm bánh */}
      <g transform="translate(80 130)">
        <circle r="17" fill="#d78d3e" />
        <circle r="17" fill="none" stroke="#a45f22" strokeWidth="2" />
        <circle r="10" fill="none" stroke="#a45f22" strokeWidth="1.5" />
        <path d="M-5 0 h10 M0 -5 v10" stroke="#a45f22" strokeWidth="1.5" />
      </g>
      <ellipse cx="60" cy="132" rx="10" ry="8" fill="#fffaf2" />
      <ellipse cx="100" cy="132" rx="10" ry="8" fill="#fffaf2" />
    </motion.svg>
  );
}
