"use client";

import { motion } from "framer-motion";

/**
 * Đầu lân kiểu Việt: đầu tròn đỏ, sừng, gương trên trán, râu và viền lông trắng,
 * thân vải kéo dài có hai đôi chân người múa. viewBox 240 × 210.
 * Lân luôn múa (nhún, lắc đầu, bước chân, chớp mắt); `burst` là cú nhảy vọt khi được chạm.
 */
const BEAT = 0.9;

export function LionDance({ className, burst }: { className?: string; burst: boolean }) {
  const loop = { repeat: Infinity, ease: "easeInOut" as const };

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
      <motion.ellipse
        cx="120"
        cy="120"
        rx="130"
        ry="100"
        fill="url(#lion-glow)"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: BEAT, ...loop }}
      />
      <motion.ellipse
        cx="130"
        cy="200"
        rx="100"
        ry="8"
        fill="#050718"
        opacity="0.5"
        style={{ originX: "130px", originY: "200px" }}
        animate={{ scaleX: burst ? [1, 0.7, 1, 0.8, 1] : [1, 0.85, 1] }}
        transition={burst ? { duration: 1.6 } : { duration: BEAT / 2, ...loop }}
      />

      {/* cả con lân lắc lư qua lại */}
      <motion.g animate={{ x: [0, 10, 0, -10, 0] }} transition={{ duration: BEAT * 4, ...loop }}>
        {/* thân vải + chân người múa */}
        <motion.g
          animate={burst ? { y: [0, -18, 0, -10, 0] } : { y: [0, -7, 0] }}
          transition={burst ? { duration: 1.4, ease: "easeInOut" } : { duration: BEAT / 2, ...loop }}
        >
          {/* thân vải phồng lên xẹp xuống theo nhịp */}
          <motion.path
            d="M110 110 C 150 90, 200 96, 232 122 C 236 140, 226 156, 214 158 L110 156 Z"
            fill="#e8472e"
            style={{ originX: "110px", originY: "156px" }}
            animate={{ scaleY: [1, 1.1, 1], skewX: [0, -4, 0] }}
            transition={{ duration: BEAT, ...loop }}
          />
          <path d="M112 118 C 150 102, 196 108, 226 130" stroke="#ffc45c" strokeWidth="4" fill="none" strokeDasharray="2 6" strokeLinecap="round" />
          <path d="M110 156 L214 158 C 214 162, 110 164, 110 160 Z" fill="#fff4e0" />
          {/* hai đôi chân bước so le */}
          {[
            [124, 142, 0],
            [186, 202, BEAT / 4],
          ].map(([a, b, delay]) => (
            <g key={a}>
              <motion.g
                style={{ originX: `${a + 6}px`, originY: "156px" }}
                animate={{ rotate: [12, -12, 12] }}
                transition={{ duration: BEAT, delay, ...loop }}
              >
                <rect x={a} y="156" width="12" height="36" rx="4" fill="#141a4a" />
                <rect x={a - 4} y="188" width="18" height="6" rx="3" fill="#0a0c24" />
              </motion.g>
              <motion.g
                style={{ originX: `${b + 6}px`, originY: "156px" }}
                animate={{ rotate: [-12, 12, -12] }}
                transition={{ duration: BEAT, delay, ...loop }}
              >
                <rect x={b} y="156" width="12" height="36" rx="4" fill="#141a4a" />
                <rect x={b - 2} y="188" width="18" height="6" rx="3" fill="#0a0c24" />
              </motion.g>
            </g>
          ))}
        </motion.g>

        {/* đầu lân */}
        <motion.g
          style={{ originX: "90px", originY: "150px" }}
          animate={
            burst
              ? { y: [0, -44, 0, -26, 0, -10, 0], rotate: [0, -16, 16, -12, 10, -4, 0], scale: [1, 1.08, 1, 1.05, 1] }
              : { y: [0, -14, 0, -8, 0], rotate: [0, -9, 0, 9, 0] }
          }
          transition={burst ? { duration: 1.6, ease: "easeInOut" } : { duration: BEAT * 2, ...loop }}
        >
          {/* viền lông */}
          <circle cx="86" cy="92" r="64" fill="#fff4e0" />
          <circle cx="86" cy="92" r="58" fill="url(#lion-head)" />
          {/* sừng */}
          <path d="M86 32 C 80 16, 90 4, 98 10 C 92 16, 94 24, 96 34 Z" fill="#ffc45c" />
          {/* gương trán */}
          <circle cx="86" cy="54" r="10" fill="#dff6ff" stroke="#ffc45c" strokeWidth="3" />
          <motion.circle cx="83" cy="51" r="3" fill="#fff" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: BEAT / 2, ...loop }} />
          {/* lông mày xanh nhướn theo nhịp */}
          <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: BEAT, ...loop }}>
            <path d="M44 70 q18 -14 34 -2" stroke="#25b597" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M94 68 q18 -12 34 2" stroke="#25b597" strokeWidth="7" fill="none" strokeLinecap="round" />
          </motion.g>
          {/* mắt + mí chớp */}
          <g>
            <circle cx="62" cy="86" r="13" fill="#fff" />
            <circle cx="110" cy="86" r="13" fill="#fff" />
            <motion.g animate={{ x: [0, 3, 0, -3, 0] }} transition={{ duration: BEAT * 4, ...loop }}>
              <circle cx="64" cy="87" r="7" fill="#1a0f06" />
              <circle cx="112" cy="87" r="7" fill="#1a0f06" />
              <circle cx="66" cy="84" r="2.2" fill="#fff" />
              <circle cx="114" cy="84" r="2.2" fill="#fff" />
            </motion.g>
            <motion.g
              style={{ originY: "73px" }}
              animate={burst ? { scaleY: [0, 1, 0, 0, 1, 0] } : { scaleY: [0, 0, 1, 0, 0, 1, 0] }}
              transition={
                burst
                  ? { duration: 1.4, times: [0, 0.1, 0.2, 0.6, 0.7, 0.8] }
                  : { duration: 3.2, repeat: Infinity, times: [0, 0.55, 0.6, 0.65, 0.85, 0.9, 0.95] }
              }
            >
              <rect x="48" y="73" width="28" height="27" rx="13" fill="#d8301a" />
              <rect x="96" y="73" width="28" height="27" rx="13" fill="#d8301a" />
            </motion.g>
          </g>
          {/* mũi + miệng đớp đớp */}
          <ellipse cx="86" cy="106" rx="16" ry="10" fill="#ffc45c" />
          <circle cx="80" cy="106" r="3" fill="#8a2412" />
          <circle cx="92" cy="106" r="3" fill="#8a2412" />
          <motion.g
            style={{ originY: "120px" }}
            animate={burst ? { scaleY: [1, 1.7, 1, 1.5, 1] } : { scaleY: [1, 1.35, 1] }}
            transition={burst ? { duration: 1.4 } : { duration: BEAT, ...loop }}
          >
            <path d="M52 118 Q86 150 120 118 Q86 132 52 118 Z" fill="#6a0d06" />
            <path d="M58 120 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -5 l4 6 l4 -6" stroke="#fff" strokeWidth="2" fill="none" />
          </motion.g>
          {/* râu phất phơ */}
          <motion.path
            d="M60 140 q-4 18 4 30 M76 146 q-2 16 4 26 M96 146 q2 16 -4 26 M112 140 q4 18 -4 30"
            stroke="#fff4e0"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{ originX: "86px", originY: "140px" }}
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: BEAT, ...loop }}
          />
          {/* tai lông vẫy */}
          <motion.circle cx="30" cy="62" r="11" fill="#fff4e0" animate={{ y: [0, -5, 0] }} transition={{ duration: BEAT / 2, ...loop }} />
          <motion.circle cx="142" cy="62" r="11" fill="#fff4e0" animate={{ y: [0, -5, 0] }} transition={{ duration: BEAT / 2, delay: BEAT / 4, ...loop }} />
        </motion.g>
      </motion.g>
    </svg>
  );
}
