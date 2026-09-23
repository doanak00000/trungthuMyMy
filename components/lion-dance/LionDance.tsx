"use client";

import { motion } from "framer-motion";

/**
 * Đầu lân kiểu Việt: đầu tròn đỏ, sừng, gương trên trán, râu và viền lông trắng,
 * thân vải kéo dài có hai đôi chân người múa. viewBox 240 × 210.
 */
export function LionDance({ className, dancing }: { className?: string; dancing: boolean }) {
  return (
    <svg viewBox="0 0 240 210" className={className} aria-hidden overflow="visible">
      <defs>
        <radialGradient id="lion-head" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#ff6a3d" />
          <stop offset="1" stopColor="#b8200f" />
        </radialGradient>
        <radialGradient id="lion-glow">
          <stop offset="0" stopColor="#ff8a4c" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff8a4c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="120" rx="130" ry="100" fill="url(#lion-glow)" />
      <ellipse cx="130" cy="200" rx="100" ry="8" fill="#050718" opacity="0.5" />

      {/* thân vải + chân người múa */}
      <motion.g
        animate={dancing ? { y: [0, -10, 0, -6, 0] } : { y: 0 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      >
        <path d="M110 110 C 150 90, 200 96, 232 122 C 236 140, 226 156, 214 158 L110 156 Z" fill="#e8472e" />
        <path d="M112 118 C 150 102, 196 108, 226 130" stroke="#ffc45c" strokeWidth="4" fill="none" strokeDasharray="2 6" strokeLinecap="round" />
        <path d="M110 156 L214 158 C 214 162, 110 164, 110 160 Z" fill="#fff4e0" />
        <g fill="#141a4a">
          <rect x="124" y="156" width="12" height="36" rx="4" />
          <rect x="142" y="156" width="12" height="36" rx="4" />
          <rect x="186" y="156" width="12" height="36" rx="4" />
          <rect x="202" y="156" width="12" height="36" rx="4" />
        </g>
        <g fill="#0a0c24">
          <rect x="120" y="188" width="18" height="6" rx="3" />
          <rect x="140" y="188" width="18" height="6" rx="3" />
          <rect x="184" y="188" width="18" height="6" rx="3" />
          <rect x="200" y="188" width="18" height="6" rx="3" />
        </g>
      </motion.g>

      {/* đầu lân */}
      <motion.g
        style={{ originX: "90px", originY: "150px" }}
        animate={
          dancing
            ? { y: [0, -34, 0, -20, 0, -8, 0], rotate: [0, -12, 12, -10, 8, -4, 0] }
            : { y: [0, -3, 0], rotate: 0 }
        }
        transition={dancing ? { duration: 1.6, ease: "easeInOut" } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* viền lông */}
        <circle cx="86" cy="92" r="64" fill="#fff4e0" />
        <circle cx="86" cy="92" r="58" fill="url(#lion-head)" />
        {/* sừng */}
        <path d="M86 32 C 80 16, 90 4, 98 10 C 92 16, 94 24, 96 34 Z" fill="#ffc45c" />
        {/* gương trán */}
        <circle cx="86" cy="54" r="10" fill="#dff6ff" stroke="#ffc45c" strokeWidth="3" />
        <circle cx="83" cy="51" r="3" fill="#fff" />
        {/* lông mày xanh */}
        <path d="M44 70 q18 -14 34 -2" stroke="#25b597" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M94 68 q18 -12 34 2" stroke="#25b597" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* mắt + mí chớp */}
        <g>
          <circle cx="62" cy="86" r="13" fill="#fff" />
          <circle cx="110" cy="86" r="13" fill="#fff" />
          <circle cx="64" cy="87" r="7" fill="#1a0f06" />
          <circle cx="112" cy="87" r="7" fill="#1a0f06" />
          <circle cx="66" cy="84" r="2.2" fill="#fff" />
          <circle cx="114" cy="84" r="2.2" fill="#fff" />
          <motion.g
            style={{ originY: "73px" }}
            animate={dancing ? { scaleY: [0, 1, 0, 0, 1, 0] } : { scaleY: [0, 0, 1, 0] }}
            transition={
              dancing
                ? { duration: 1.4, times: [0, 0.1, 0.2, 0.6, 0.7, 0.8] }
                : { duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }
            }
          >
            <rect x="48" y="73" width="28" height="27" rx="13" fill="#d8301a" />
            <rect x="96" y="73" width="28" height="27" rx="13" fill="#d8301a" />
          </motion.g>
        </g>
        {/* mũi + miệng */}
        <ellipse cx="86" cy="106" rx="16" ry="10" fill="#ffc45c" />
        <circle cx="80" cy="106" r="3" fill="#8a2412" />
        <circle cx="92" cy="106" r="3" fill="#8a2412" />
        <motion.g
          style={{ originY: "120px" }}
          animate={dancing ? { scaleY: [1, 1.5, 1, 1.4, 1] } : { scaleY: 1 }}
          transition={{ duration: 1.4 }}
        >
          <path d="M52 118 Q86 150 120 118 Q86 132 52 118 Z" fill="#6a0d06" />
          <path d="M58 120 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -6" stroke="#fff" strokeWidth="2" fill="none" />
        </motion.g>
        {/* râu */}
        <path d="M60 140 q-4 18 4 30 M76 146 q-2 16 4 26 M96 146 q2 16 -4 26 M112 140 q4 18 -4 30" stroke="#fff4e0" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* tai lông */}
        <circle cx="30" cy="62" r="11" fill="#fff4e0" />
        <circle cx="142" cy="62" r="11" fill="#fff4e0" />
      </motion.g>
    </svg>
  );
}
