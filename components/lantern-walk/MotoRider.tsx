"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { faces } from "@/data/festival";
import { PhotoHead } from "./Walkers";

const INK = "#05071a";

/**
 * Chiếc sportbike (quay đầu sang trái) và LuLu nằm rạp trên xe.
 * viewBox 150 × 130, bánh xe chạm đất ở y ≈ 128.
 * `rider` = false thì chỉ còn chiếc xe dựng chân chống.
 */
export function MotoRider({ moving, rider = true, className = "" }: { moving: boolean; rider?: boolean; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const beam = `beam-${uid}`;
  const paint = `paint-${uid}`;
  const spin = moving ? { rotate: -360 } : { rotate: 0 };
  const spinT = moving ? { duration: 0.35, repeat: Infinity, ease: "linear" as const } : { duration: 0.3 };

  return (
    <svg viewBox="0 0 150 130" className={className} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={beam} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe6a4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe6a4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={paint} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4a36" />
          <stop offset="1" stopColor="#a8190c" />
        </linearGradient>
      </defs>

      {/* đèn pha hắt ra phía trước */}
      <motion.path d="M24 74 L-80 52 L-80 104 Z" fill={`url(#${beam})`} animate={{ opacity: moving ? 1 : 0.3 }} />

      {/* vệt gió khi đang chạy */}
      {moving && (
        <g stroke="#b7bce6" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <motion.path d="M150 60 h26" animate={{ x: [0, 18], opacity: [0.8, 0] }} transition={{ duration: 0.4, repeat: Infinity }} />
          <motion.path d="M146 80 h34" animate={{ x: [0, 22], opacity: [0.8, 0] }} transition={{ duration: 0.4, delay: 0.15, repeat: Infinity }} />
          <motion.path d="M140 100 h22" animate={{ x: [0, 16], opacity: [0.8, 0] }} transition={{ duration: 0.4, delay: 0.25, repeat: Infinity }} />
        </g>
      )}

      {/* càng sau + ống xả */}
      <path d="M86 96 L118 111" stroke="#1a1f5a" strokeWidth="7" strokeLinecap="round" />
      <path d="M100 90 L136 78" stroke="#8a90b8" strokeWidth="6" strokeLinecap="round" />
      <path d="M130 80 L138 77" stroke="#c9cde6" strokeWidth="4" strokeLinecap="round" />

      {/* bánh xe mâm 5 chấu */}
      {[30, 118].map((cx) => (
        <motion.g key={cx} animate={spin} transition={spinT}>
          <circle cx={cx} cy="111" r="17" fill={INK} stroke="#4a52b0" strokeWidth="3" />
          <circle cx={cx} cy="111" r="10" fill="none" stroke="#c8261a" strokeWidth="1.5" />
          {[0, 72, 144, 216, 288].map((a) => (
            <line key={a} x1={cx} y1="111" x2={cx} y2="101" stroke="#8a90b8" strokeWidth="2" transform={`rotate(${a} ${cx} 111)`} />
          ))}
          <circle cx={cx} cy="111" r="3" fill="#c9cde6" />
        </motion.g>
      ))}

      {/* phuộc trước */}
      <path d="M30 111 L46 64" stroke="#c9cde6" strokeWidth="5" strokeLinecap="round" />

      {/* bụng xe */}
      <path d="M44 92 L102 88 L94 104 L58 106 Z" fill="#1a1450" />
      {/* dàn áo mũi nhọn */}
      <path d="M18 80 L42 62 L72 58 L82 70 L64 92 L34 94 Z" fill={`url(#${paint})`} />
      {/* bình xăng + thân */}
      <path d="M62 66 L96 60 L110 70 L102 88 L64 92 Z" fill={`url(#${paint})`} />
      {/* đuôi vểnh */}
      <path d="M94 62 L142 46 L144 53 L110 76 Z" fill={`url(#${paint})`} />
      <path d="M96 60 L122 54 L124 58 L100 66 Z" fill="#1a1450" />
      {/* kính chắn gió */}
      <path d="M42 62 L54 46 L64 56 Z" fill="#6a74c8" opacity="0.85" />
      {/* sọc trắng + số đua */}
      <path d="M24 82 L66 70 L100 64" stroke="#fff4e0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="80" r="7" fill="#fff4e0" />
      <text x="50" y="83.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#c8261a" fontFamily="var(--font-vn)">
        14
      </text>
      {/* mắt đèn pha xếch */}
      <path d="M21 77 L36 70 L38 74 L24 80 Z" fill="#fff2c4" />
      {/* đèn hậu */}
      <path d="M140 48 L145 47 L144 52 Z" fill="#ff5a6e" />

      {/* chân chống khi dựng xe */}
      {!rider && <path d="M80 102 L72 126" stroke="#8a90b8" strokeWidth="3.5" strokeLinecap="round" />}

      {/* LuLu nằm rạp trên xe */}
      {rider && (
        <g>
          {/* chân: đùi ôm bình xăng, gác lên gác chân */}
          <path d="M94 62 L76 78 L88 96" stroke={INK} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* thân người rạp về trước */}
          <path d="M100 60 C 96 48, 80 38, 64 38 L58 46 C 70 50, 82 58, 88 66 Z" fill={INK} />
          {/* tay nắm tay lái */}
          <path d="M66 44 L48 60" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          {faces.him ? (
            <PhotoHead id={`moto-${uid}`} src={faces.him} cx={56} cy={28} r={16} />
          ) : (
            <circle cx="56" cy="30" r="13" fill={INK} />
          )}
        </g>
      )}
    </svg>
  );
}
