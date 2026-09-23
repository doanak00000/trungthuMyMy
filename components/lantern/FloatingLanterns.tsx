"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { LanternId } from "@/data/festival";
import { LanternArt } from "./LanternArt";

const KINDS: LanternId[] = ["star", "moon", "flower", "star", "moon", "rabbit", "star", "moon"];

/** Những chiếc đèn nhỏ trôi chậm từ dưới lên, không chặn thao tác. */
export function FloatingLanterns({
  count = 6,
  className = "",
  lanes,
}: {
  count?: number;
  className?: string;
  /** Vị trí ngang (%) cho phép đèn bay, để tránh chỗ có chữ */
  lanes?: number[];
}) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        kind: KINDS[i % KINDS.length],
        left: lanes ? lanes[i % lanes.length] : 6 + ((i * 37) % 88),
        size: 26 + ((i * 13) % 22),
        duration: 26 + ((i * 7) % 16),
        delay: i * 2.6,
        drift: i % 2 ? 18 : -14,
      })),
    [count, lanes],
  );

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}>
      {items.map((it, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0"
          style={{ left: `${it.left}%`, width: it.size }}
          initial={{ y: "15vh", x: 0, opacity: 0 }}
          animate={{ y: "-105vh", x: it.drift, opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: it.duration, delay: it.delay, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.8, 1] }}
        >
          <LanternArt id={it.kind} string={false} className="anim-sway-small w-full origin-top" />
        </motion.div>
      ))}
    </div>
  );
}
