"use client";

import { motion } from "framer-motion";

type Props = {
  /** Toạ độ theo % của cả con phố */
  left: number;
  top: number;
  width: number;
  label?: string;
  visited: boolean;
  onActivate: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  /** Khoảng cách từ đáy hình tới thẻ tên (% chiều cao phố) */
  tagTop?: number;
};

/** Một điểm chạm trên phố: hình vẽ là nút bấm, bên dưới có thẻ giấy tên chỗ đó. */
export function Hotspot({ left, top, width, label, visited, onActivate, children, ariaLabel, tagTop }: Props) {
  return (
    <>
      <motion.button
        type="button"
        aria-label={ariaLabel}
        onClick={onActivate}
        whileTap={{ scale: 0.97 }}
        className="absolute block"
        style={{ left: `${left}%`, top: `${top}%`, width: `${width}%` }}
      >
        {children}
      </motion.button>
      {label && (
        <button
          type="button"
          onClick={onActivate}
          tabIndex={-1}
          aria-hidden
          className={`absolute flex -translate-x-1/2 items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[13px] font-bold transition-colors ${
            visited ? "bg-dusk/90 text-cloud/70" : "anim-tag-pulse bg-glow text-[#3b1206]"
          }`}
          style={{ left: `${left + width / 2}%`, top: `${tagTop ?? 79}%` }}
        >
          {visited ? (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          ) : (
            <span className="size-1.5 rounded-full bg-[#7a2a0c]/60" />
          )}
          {label}
        </button>
      )}
    </>
  );
}
