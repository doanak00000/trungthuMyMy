"use client";

import { motion } from "framer-motion";

type Gift = { src: string; name: string; note: string; alt: string };

/**
 * Một bó hoa trong hộp quà: ảnh hoa trong khung giấy gói, buộc nơ đỏ,
 * tên và một dòng nhắn viết tay bên dưới.
 */
export function FlowerGift({ gift, tilt }: { gift: Gift; tilt: number }) {
  return (
    <figure className="flex w-full flex-col items-center">
      <motion.div
        className="relative isolate w-[min(72vw,320px,40svh)]"
        initial={{ rotate: 0 }}
        animate={{ rotate: tilt }}
        transition={{ delay: 0.6, type: "spring", damping: 12 }}
      >
        {/* quầng sáng sau bó hoa */}
        <span
          aria-hidden
          className="absolute -inset-[18%] -z-10 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(255,210,140,0.35), transparent)" }}
        />
        {/* giấy gói */}
        <div className="rounded-[6px] bg-[#fdf6e8] p-2.5 pb-9 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.75)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gift.src}
            alt={gift.alt}
            decoding="async"
            className="aspect-[4/5] w-full rounded-[3px] bg-dusk object-cover"
            style={{ objectPosition: "50% 40%" }}
          />
        </div>
        {/* nơ đỏ */}
        <svg viewBox="0 0 120 60" className="absolute -bottom-5 left-1/2 w-[46%] -translate-x-1/2" aria-hidden>
          <path d="M60 26 C 40 2, 8 8, 16 28 C 22 40, 48 34, 60 26 Z" fill="#e8472e" />
          <path d="M60 26 C 80 2, 112 8, 104 28 C 98 40, 72 34, 60 26 Z" fill="#e8472e" />
          <path d="M56 30 L 40 58 L 50 56 L 58 34 Z M64 30 L 80 58 L 70 56 L 62 34 Z" fill="#c8261a" />
          <circle cx="60" cy="27" r="7" fill="#ff6a50" />
          <path d="M26 22 C 32 16, 42 16, 50 22" stroke="#ff8a6a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
      <figcaption className="mt-9 max-w-[22rem] px-4 text-center">
        <p className="text-[21px] font-extrabold text-cloud">{gift.name}</p>
        <p className="mt-1 font-hand text-[17px] leading-[1.8] text-moon text-balance">{gift.note}</p>
      </figcaption>
    </figure>
  );
}
