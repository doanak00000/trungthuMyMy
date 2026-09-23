"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { getAudio } from "@/lib/audio";

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  children: React.ReactNode;
  arrow?: boolean;
  tone?: "glow" | "quiet";
};

/**
 * Nút hình thẻ giấy đỏ-vàng có lỗ xỏ dây, như thẻ treo trên lồng đèn.
 * Mọi lời mời bước tiếp trong câu chuyện đều dùng nút này.
 */
export function PaperButton({ children, arrow, tone = "glow", className = "", onClick, ...rest }: Props) {
  const glow = tone === "glow";
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        getAudio().unlock();
        getAudio().bell(glow ? 1 : 1.25);
        onClick?.(e);
      }}
      className={`group relative isolate inline-flex min-h-12 items-center gap-3 px-6 py-3 text-[17px] font-bold tracking-[0.01em] ${
        glow ? "text-[#3b1206]" : "text-cloud"
      } ${className}`}
      {...rest}
    >
      <span
        aria-hidden
        className={`absolute inset-0 ${glow ? "anim-flicker" : ""}`}
        style={{
          clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
          background: glow
            ? "linear-gradient(180deg, #ffd47a 0%, #ffab3d 100%)"
            : "color-mix(in oklab, #161b52 80%, transparent)",
          boxShadow: glow ? "none" : "inset 0 0 0 1px rgba(255,196,92,0.45)",
          animationDuration: "4s",
        }}
      />
      {glow && (
        <span
          aria-hidden
          className="absolute -inset-3 -z-10 rounded-[40%] opacity-70 blur-xl"
          style={{ background: "radial-gradient(closest-side, rgba(255,170,60,0.55), transparent)" }}
        />
      )}
      {/* lỗ xỏ dây */}
      <span
        aria-hidden
        className={`relative size-2 rounded-full ${glow ? "bg-[#7a2a0c]/60" : "bg-glow/60"}`}
      />
      <span className="relative">{children}</span>
      {arrow && (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="relative size-5 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      )}
    </motion.button>
  );
}
