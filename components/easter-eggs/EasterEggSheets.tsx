"use client";

import { motion } from "framer-motion";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { Sheet } from "@/components/ui/Sheet";
import { PromiseCorner } from "./PromiseCorner";

/** Ba món quà ẩn: những lời hẹn (chạm trăng), ngôi sao có tên, và đom đóm. */
export function EasterEggSheets() {
  const { overlay, setOverlay } = useStory();
  const e = messages.easterEggs;
  const close = () => setOverlay(null);

  return (
    <>
      <Sheet open={overlay === "promises"} onClose={close} title={e.moon.title} tone="hush">
        <PromiseCorner />
      </Sheet>

      <Sheet open={overlay === "star"} onClose={close} title={e.star.title} tone="hush">
        <div className="flex flex-col items-center pb-2 pt-2 text-center">
          <motion.svg
            viewBox="0 0 24 24"
            className="size-16 drop-shadow-[0_0_18px_rgba(255,190,220,0.9)]"
            initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 10 }}
            aria-hidden
          >
            <path d="M12 1.5c.6 5.2 2.2 8.4 10.5 10.5C14.2 14.1 12.6 17.3 12 22.5 11.4 17.3 9.8 14.1 1.5 12 9.8 9.9 11.4 6.7 12 1.5z" fill="#ffe3f0" />
          </motion.svg>
          <p className="mt-5 font-hand text-[18px] leading-[1.8] text-moon text-balance">{e.star.body}</p>
        </div>
      </Sheet>

      <Sheet open={overlay === "firefly"} onClose={close} title={e.firefly.title} tone="hush">
        <div className="flex flex-col items-center pb-2 pt-2 text-center">
          <div className="relative grid size-24 place-items-center">
            <span className="anim-flicker absolute inset-0 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(214,255,120,0.55), transparent)" }} />
            <span className="size-3 rounded-full bg-[#eaffa0] shadow-[0_0_14px_6px_rgba(214,255,120,0.6)]" />
          </div>
          <p className="mt-4 text-[16px] leading-relaxed text-cloud/90 text-balance">{e.firefly.body}</p>
        </div>
      </Sheet>
    </>
  );
}
