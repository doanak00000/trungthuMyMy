"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { festivalConfig } from "@/data/festival";
import { messages } from "@/data/messages";
import { useStory, type LocationId } from "@/components/story/StoryContext";
import { PaperButton } from "@/components/ui/PaperButton";
import { Sheet } from "@/components/ui/Sheet";
import { MooncakeStall } from "@/components/mooncake/MooncakeStall";
import { MooncakeBox } from "@/components/mooncake/MooncakeBox";
import { MoonRabbit } from "@/components/rabbit/MoonRabbit";
import { RabbitQuiz } from "@/components/rabbit/RabbitQuiz";
import { LionSpot } from "@/components/lion-dance/LionSpot";
import { FlowerGarden } from "@/components/garden/FlowerGarden";
import { getAudio } from "@/lib/audio";
import { FarRoofs, StreetScenery, STREET_H, STREET_W } from "./StreetScenery";
import { Hotspot } from "./Hotspot";
import { GlowDefs, glow } from "@/components/ui/GlowDefs";

const MAIN: LocationId[] = ["mooncake", "lion", "rabbit"];
const STREET_WIDTH = `calc(100dvh * ${STREET_W / STREET_H})`;

/** Màn 4 — con phố đèn cuộn ngang. Ghé đủ chỗ thì LuLu tới rủ đi rước đèn. */
export function FestivalStreet() {
  const { visited, visit, go } = useStory();
  const f = messages.festival;
  const scroller = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState<LocationId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollX } = useScroll({ container: scroller });
  const farX = useTransform(scrollX, (v) => -v * 0.55);
  const ready = visited.length >= festivalConfig.minVisitsToWalk;

  useEffect(() => {
    getAudio().setMood("street");
    return scrollX.on("change", (v) => v > 40 && setScrolled(true));
  }, [scrollX]);

  // Chuột: lăn dọc thành cuộn ngang, và kéo để đi dạo.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = () => (dragging = false);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const open = (id: LocationId) => {
    visit(id);
    setSheet(id);
  };

  const pct = (x: number) => (x / STREET_W) * 100;
  const pctY = (y: number) => (y / STREET_H) * 100;

  return (
    <motion.section
      className="fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      transition={{ duration: 1.6 }}
    >
      {/* mái nhà xa — parallax */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 left-0" style={{ x: farX, width: STREET_WIDTH }}>
        <FarRoofs />
      </motion.div>

      <div ref={scroller} className="no-scrollbar absolute inset-0 overflow-x-auto overflow-y-hidden overscroll-x-contain">
        <div className="relative h-dvh" style={{ width: STREET_WIDTH }}>
          <StreetScenery />

          <Hotspot
            left={pct(320)}
            top={pctY(372)}
            width={pct(270)}
            label={f.labels.mooncake}
            ariaLabel={f.labels.mooncake}
            visited={visited.includes("mooncake")}
            onActivate={() => open("mooncake")}
          >
            <MooncakeStall className="w-full" />
          </Hotspot>

          <div className="absolute" style={{ left: `${pct(700)}%`, top: `${pctY(392)}%`, width: `${pct(250)}%` }}>
            <LionSpot onDance={() => visit("lion")} />
          </div>
          <span
            aria-hidden
            className={`pointer-events-none absolute flex -translate-x-1/2 items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[13px] font-bold ${
              visited.includes("lion") ? "bg-dusk/90 text-cloud/70" : "anim-tag-pulse bg-glow text-[#3b1206]"
            }`}
            style={{ left: `${pct(825)}%`, top: "79%" }}
          >
            {f.labels.lion}
          </span>

          <Hotspot
            left={pct(1150)}
            top={pctY(470)}
            width={pct(125)}
            label={f.labels.rabbit}
            ariaLabel={f.labels.rabbit}
            visited={visited.includes("rabbit")}
            onActivate={() => open("rabbit")}
          >
            <MoonRabbit className="w-full" />
          </Hotspot>

          {/* lối nhỏ bí mật ở cuối phố: không có thẻ tên, chỉ có mấy đốm sáng dẫn đường */}
          <button
            type="button"
            aria-label={f.labels.garden}
            onClick={() => open("garden")}
            className="absolute"
            style={{ left: `${pct(1560)}%`, top: `${pctY(500)}%`, width: `${pct(240)}%`, height: `${pctY(200)}%` }}
          >
            <svg viewBox="0 0 240 200" className="size-full" aria-hidden overflow="visible">
              <GlowDefs />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <circle
                  key={i}
                  cx={20 + i * 30}
                  cy={150 - i * 12 + (i % 2 ? 8 : -4)}
                  r={2.4}
                  fill="#ffe6a4"
                  className="anim-shimmer"
                  style={{ animationDelay: `${-i * 0.5}s` }}
                />
              ))}
              {[
                [180, 70, "#d8428f"],
                [206, 84, "#9b8cff"],
                [226, 64, "#ffd47a"],
              ].map(([x, y, c]) => (
                <g key={String(x)} opacity="0.75">
                  <circle cx={Number(x)} cy={Number(y)} r="24" fill={glow(String(c))} />
                  <circle cx={Number(x)} cy={Number(y)} r="4" fill={String(c)} />
                </g>
              ))}
            </svg>
          </button>
        </div>
      </div>

      {/* thanh tiến độ */}
      <div className="pointer-events-none fixed left-[max(14px,env(safe-area-inset-left))] top-[max(14px,env(safe-area-inset-top))] z-35 flex items-center gap-2 rounded-full bg-shadow/45 py-1.5 pl-2 pr-3 backdrop-blur-[2px]">
        {[...MAIN, ...(visited.includes("garden") ? (["garden"] as LocationId[]) : [])].map((id) => {
          const on = visited.includes(id);
          return (
            <span
              key={id}
              className="size-2.5 rounded-full transition-all duration-700"
              style={{
                background: on ? (id === "garden" ? "#ff8cc0" : "#ffc45c") : "#3a4090",
                boxShadow: on ? "0 0 10px 2px rgba(255,196,92,0.6)" : "none",
              }}
            />
          );
        })}
        <span className="ml-1 text-[12px] font-semibold text-cloud/80">
          {f.progress(Math.min(visited.length, festivalConfig.minVisitsToWalk), festivalConfig.minVisitsToWalk)}
        </span>
      </div>

      {/* gợi ý + lời mời của LuLu */}
      <div className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+20px)] right-4 z-35 flex max-w-[64vw] flex-col items-end gap-3 text-right">
        <AnimatePresence mode="wait">
          {!ready && (
            <motion.p
              key={scrolled ? "tap" : "swipe"}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-full bg-shadow/55 px-3.5 py-2 text-[13px] font-medium text-cloud/90"
            >
              {scrolled ? f.tapHint : f.enterHint}
              {!scrolled && (
                <motion.svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  aria-hidden
                >
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </motion.svg>
              )}
            </motion.p>
          )}
          {ready && (
            <motion.div
              key="lulu"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pointer-events-auto flex flex-col items-end gap-2"
            >
              <p className="font-hand text-[17px] leading-[1.8] text-moon [text-shadow:0_2px_12px_rgba(6,8,30,0.9)]">{f.lulu.arrived}</p>
              <PaperButton arrow onClick={() => go("walk")}>
                {f.lulu.cta}
              </PaperButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Sheet open={sheet === "mooncake"} onClose={() => setSheet(null)} title={messages.mooncake.heading}>
        <MooncakeBox />
      </Sheet>
      <Sheet open={sheet === "rabbit"} onClose={() => setSheet(null)} title={f.labels.rabbit}>
        <RabbitQuiz />
      </Sheet>
      <Sheet open={sheet === "garden"} onClose={() => setSheet(null)} title={messages.garden.heading} tone="hush">
        <FlowerGarden />
      </Sheet>
    </motion.section>
  );
}
