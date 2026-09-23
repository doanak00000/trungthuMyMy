"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { messages } from "@/data/messages";
import { Heart } from "@/components/ui/Heart";

/**
 * Lá thư viết tay trên giấy ô ly, mực tím học trò.
 * Các đoạn hiện dần như đang được viết; chạm vào thư để hiện hết luôn.
 */
export function Letter({ onDone }: { onDone?: () => void }) {
  const l = messages.letter;
  const blocks = [l.greeting, ...l.paragraphs];
  const [shown, setShown] = useState(0);
  const total = blocks.length + 1; // +1 cho chữ ký

  useEffect(() => {
    if (shown >= total) {
      onDone?.();
      return;
    }
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 900 : 2100);
    return () => window.clearTimeout(t);
  }, [shown, total, onDone]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scaleY: 0.3, rotate: -2 }}
      animate={{ opacity: 1, y: 0, scaleY: 1, rotate: -0.6 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ originY: 1 }}
      onClick={() => setShown(total)}
      className="relative mx-auto w-full max-w-[440px] cursor-default rounded-[4px] pb-[36px] pt-[30px] pl-[52px] pr-6 text-ink-violet shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7),0_0_80px_-10px_rgba(255,196,92,0.35)]"
    >
      {/* giấy ô ly: dòng kẻ lớn mỗi 36px, ô nhỏ 9px, lề đỏ bên trái */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[4px]"
        style={{
          backgroundColor: "#fbf6ea",
          backgroundImage: [
            "linear-gradient(90deg, transparent 38px, #e79a9a 38px, #e79a9a 39.5px, transparent 39.5px)",
            "repeating-linear-gradient(180deg, transparent 0 35px, #98a8e0 35px 36px)",
            "repeating-linear-gradient(180deg, transparent 0 8px, #dfe5f7 8px 9px)",
            "repeating-linear-gradient(90deg, transparent 0 8px, #e8ecf9 8px 9px)",
          ].join(","),
          backgroundPosition: "0 0, 0 0, 0 0, 0 0",
        }}
      />
      <div className="relative font-hand text-[16.5px] leading-[36px] tracking-[0.005em] sm:text-[17.5px]">
        {blocks.map((text, i) => (
          <motion.p
            key={i}
            initial={false}
            animate={
              shown > i
                ? { opacity: 1, clipPath: "inset(0 0% 0 0)" }
                : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
            }
            transition={{ duration: 1.8, ease: "easeOut" }}
            className={`whitespace-pre-line ${i === 0 ? "mb-[36px] text-[19px]" : "mb-[36px] last:mb-0"}`}
          >
            {text}
          </motion.p>
        ))}
        <motion.div
          initial={false}
          animate={shown >= total ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 1.4 }}
          className="mt-[36px] flex flex-col items-end pr-2"
        >
          <p className="text-[22px] leading-[36px]">
            <Heart className="mr-2 inline size-5 -translate-y-0.5" color="#e0415a" />
            {l.signature}
          </p>
        </motion.div>
      </div>
    </motion.article>
  );
}
