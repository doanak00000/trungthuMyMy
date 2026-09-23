"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { games } from "@/data/games";
import { getAudio } from "@/lib/audio";
import { maxPlays } from "@/lib/gameLimits";
import { FishScoop } from "./FishScoop";
import { ClawMachine } from "./ClawMachine";
import { FortuneJar } from "./FortuneJar";

type Tab = keyof typeof games.tabs;
const TABS: Tab[] = ["fish", "claw", "fortune"];

const TAG_CLIP =
  "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)";

/** Khu trò chơi: chọn trò bằng các thẻ giấy, mỗi trò chơi gọn trong một khung. */
export function GameCorner() {
  const [tab, setTab] = useState<Tab>("fish");

  return (
    <div>
      {/* bảng thông báo trúng thưởng */}
      <div className="rounded-[14px] px-4 py-3 text-[#4a1606]" style={{ background: "linear-gradient(160deg, #ffe39a, #ffc45c)" }}>
        <p className="text-[16px] font-extrabold">{games.banner.title}</p>
        <ul className="mt-1.5 space-y-0.5 text-[13.5px] font-semibold">
          {games.banner.prizes.map((p) => (
            <li key={p} className="flex gap-2">
              <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-vermilion" />
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[12.5px] text-[#6a2a0c]">{games.banner.rule(maxPlays)}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="tablist">
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setTab(t);
                getAudio().bell(1.25);
              }}
              className={`flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap px-1.5 text-[13px] font-bold transition-colors ${
                active ? "bg-glow text-[#3b1206]" : "bg-indigo/70 text-cloud/85"
              }`}
              style={{ clipPath: TAG_CLIP }}
            >
              <TabIcon tab={t} />
              {games.tabs[t]}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {tab === "fish" && <FishScoop />}
            {tab === "claw" && <ClawMachine />}
            {tab === "fortune" && <FortuneJar />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabIcon({ tab }: { tab: Tab }) {
  const common = { viewBox: "0 0 24 24", className: "size-4 shrink-0", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (tab === "fish")
    return (
      <svg {...common}>
        <path d="M3 12c3-5 9-6 14-2l4-3v10l-4-3c-5 4-11 3-14-2z" />
        <circle cx="14" cy="11" r="0.8" fill="currentColor" />
      </svg>
    );
  if (tab === "claw")
    return (
      <svg {...common}>
        <path d="M12 2v7" />
        <path d="M8 9h8" />
        <path d="M9 9l-3 6 3 4M15 9l3 6-3 4" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M6 9h12v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
      <path d="M9 9V3M12 9V2M15 9V4" />
    </svg>
  );
}
