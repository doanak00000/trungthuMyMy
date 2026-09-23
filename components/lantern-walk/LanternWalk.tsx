"use client";

import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { festivalConfig } from "@/data/festival";
import { messages } from "@/data/messages";
import { useStory } from "@/components/story/StoryContext";
import { getAudio } from "@/lib/audio";
import { SkyLantern } from "./SkyLantern";
import { Walkers } from "./Walkers";
import { MotoRider } from "./MotoRider";
import { TapIcon } from "@/components/ui/TapIcon";
import { GlowDefs } from "@/components/ui/GlowDefs";
import {
  BRIDGE_STOP,
  BridgeSeg,
  FarBankSeg,
  FarHills,
  FlowerSeg,
  Foreground,
  LandSeg,
  RiverSeg,
  SEG_W,
  StreetSeg,
} from "./WalkScenery";

const MID = [StreetSeg, FlowerSeg, RiverSeg, LandSeg, BridgeSeg, FarBankSeg];
const FAR_COUNT = 4;
const FORE_COUNT = 9;

type Geo = { unit: number; travel: number };

/** Một lát cảnh 1200 × 800, tự dịch chuyển theo tiến độ đi bộ và tốc độ parallax của lớp nó. */
function Slice({
  progress,
  geo,
  start,
  speed,
  children,
  className = "",
}: {
  progress: MotionValue<number>;
  geo: React.RefObject<Geo>;
  start: number;
  speed: number;
  children: React.ReactNode;
  className?: string;
}) {
  const x = useTransform(progress, (p) => (start - p * geo.current.travel * speed) * geo.current.unit);
  return (
    <motion.svg
      viewBox={`0 0 ${SEG_W} 800`}
      preserveAspectRatio="none"
      className={`absolute left-0 top-0 h-full ${className}`}
      style={{ x, width: `calc(100svh * ${(SEG_W + 2) / 800})` }}
      aria-hidden
    >
      <GlowDefs />
      {children}
    </motion.svg>
  );
}

type Released = { id: number; x: number; y: number };
/** chờ → LuLu chạy xe tới → xuống xe nắm tay → cùng đi */
type Phase = "wait" | "arrive" | "dismount" | "walk";
const ARRIVE_SECONDS = 3.4;

/**
 * Màn 5 — MyMy đứng chờ, LuLu chạy xe máy ngược chiều tới đón, dựng xe, nắm tay em
 * rồi hai đứa cùng đi rước đèn. Cảnh tự trôi, chạm vào đèn để thả đèn trời.
 */
export function LanternWalk() {
  const { lantern, go } = useStory();
  const w = messages.walk;
  const progress = useMotionValue(0);
  const geo = useRef<Geo>({ unit: 1, travel: 4800 });
  const walkersRef = useRef<HTMLDivElement>(null);
  const [walking, setWalking] = useState(true);
  const [phase, setPhase] = useState<Phase>("wait");
  const [releasedOnce, setReleasedOnce] = useState(false);
  const [caption, setCaption] = useState(-1);
  const [released, setReleased] = useState<Released[]>([]);
  const nextId = useRef(0);

  // Tính tỉ lệ: 800 đơn vị thế giới = chiều cao màn hình. Quãng đường đi = tới chân cầu.
  useLayoutEffect(() => {
    const measure = () => {
      const unit = window.innerHeight / 800;
      const rect = walkersRef.current?.getBoundingClientRect();
      const center = rect ? rect.left + rect.width / 2 : window.innerWidth * 0.4;
      geo.current = { unit, travel: BRIDGE_STOP - center / unit };
      progress.set(progress.get() + 0.000001);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [progress]);

  // chiếc xe dựng lại bên đường, trôi ra sau theo cảnh khi hai đứa bắt đầu đi
  const parkedX = useTransform(progress, (p) => -p * geo.current.travel * geo.current.unit);

  useEffect(() => {
    getAudio().setMood("walk");
    const timers = [
      window.setTimeout(() => {
        setPhase("arrive");
        getAudio().motor(ARRIVE_SECONDS);
      }, 1200),
      window.setTimeout(() => {
        setPhase("dismount");
        getAudio().bell(1.2);
      }, 1200 + ARRIVE_SECONDS * 1000),
      window.setTimeout(() => setPhase("walk"), 1200 + ARRIVE_SECONDS * 1000 + 2400),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "walk") return;
    const controls = animate(progress, 1, {
      duration: festivalConfig.walkDurationSeconds,
      ease: [0.35, 0.05, 0.55, 1],
      onComplete: () => {
        setWalking(false);
        window.setTimeout(() => go("bridge"), 1800);
      },
    });
    return () => controls.stop();
  }, [phase, progress, go]);

  useMotionValueEvent(progress, "change", (p) => {
    let idx = -1;
    w.captions.forEach((c, i) => {
      if (p >= c.at) idx = i;
    });
    if (idx !== caption) setCaption(idx);
  });

  const release = (e: React.PointerEvent) => {
    if (released.length > 10) return;
    const id = nextId.current++;
    setReleased((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
    setReleasedOnce(true);
    getAudio().chime();
    window.setTimeout(() => setReleased((r) => r.filter((l) => l.id !== id)), 9000);
  };

  return (
    <motion.section
      className="fixed inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.4 } }}
      transition={{ duration: 1.6 }}
      onPointerDown={release}
    >
      {/* đồi xa */}
      {Array.from({ length: FAR_COUNT }, (_, i) => (
        <Slice key={`f${i}`} progress={progress} geo={geo} start={i * SEG_W} speed={0.22}>
          <FarHills />
        </Slice>
      ))}

      {/* vài chiếc đèn trời bay xa xa */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[12, 38, 64, 84].map((left, i) => (
          <SkyLantern key={left} left={left} delay={i * 5 + 2} duration={24 + i * 4} size={14 + (i % 2) * 6} />
        ))}
      </div>

      {/* cảnh chính */}
      {MID.map((Seg, i) => (
        <Slice key={`m${i}`} progress={progress} geo={geo} start={i * SEG_W} speed={1}>
          <Seg />
        </Slice>
      ))}

      {/* hai đứa */}
      <div
        ref={walkersRef}
        className="pointer-events-none absolute left-[max(30vw,calc(50vw_-_220px))] w-[min(54vw,calc(28svh*220/230))]"
        style={{ bottom: `calc(100svh * ${(800 - 620) / 800} - min(54vw, 28svh * 220 / 230) * ${8 / 220})` }}
      >
        {/* ánh đèn hắt sau lưng để bóng hai đứa nổi lên */}
        <div
          aria-hidden
          className="anim-flicker absolute -inset-x-[40%] -bottom-[10%] -top-[20%]"
          style={{ background: `radial-gradient(ellipse 50% 50% at 55% 55%, ${lantern.glow}38, #ffb45a14 55%, transparent 75%)` }}
        />
        {/* vũng sáng của chiếc đèn MyMy chọn, hắt xuống mặt đường */}
        <div
          aria-hidden
          className="anim-flicker absolute -bottom-[14%] left-[20%] h-[26%] w-[130%] rounded-[50%]"
          style={{ background: `radial-gradient(ellipse 50% 50% at 60% 50%, ${lantern.glow}66, ${lantern.glow}1f 45%, transparent 72%)` }}
        />
        {/* xe máy của LuLu: chạy từ phải sang, phanh lại bên trái MyMy, rồi dựng đó */}
        {phase !== "wait" && (
          <motion.div className="absolute bottom-[1.5%] left-[-60%] w-[68%]" style={{ x: parkedX }}>
            <motion.div
              initial={{ x: "180vw" }}
              animate={{ x: "0vw" }}
              transition={{ duration: ARRIVE_SECONDS, ease: [0.12, 0.55, 0.3, 1] }}
            >
              <motion.div
                animate={phase === "dismount" || phase === "walk" ? { y: [0, -6, 0] } : { y: [0, -1.5, 0] }}
                transition={phase === "arrive" ? { duration: 0.25, repeat: Infinity } : { duration: 0.4 }}
              >
                <MotoRider moving={phase === "arrive"} rider={phase === "arrive"} className="w-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          animate={phase === "dismount" ? { y: [0, -8, 0] } : { y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Walkers herLantern={lantern.id} walking={walking && phase === "walk"} withHim={phase === "dismount" || phase === "walk"} className="w-full" />
        </motion.div>

        {/* hướng dẫn: chạm vào chiếc đèn đang cầm để thả đèn */}
        <AnimatePresence>
          {phase === "walk" && !releasedOnce && (
            <motion.div
              className="absolute bottom-[80%] right-[-6%] flex w-[max(190px,90%)] flex-col items-end"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <p className="rounded-[12px] bg-cloud px-3 py-2 text-right text-[13.5px] font-semibold leading-snug text-[#2a1406] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)]">
                {w.tapHint}
              </p>
              <motion.div
                className="mr-[2%] mt-6 w-9"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <TapIcon />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* cỏ sát ống kính */}
      {Array.from({ length: FORE_COUNT }, (_, i) => (
        <Slice key={`g${i}`} progress={progress} geo={geo} start={i * SEG_W} speed={1.35} className="opacity-95">
          <Foreground seed={i * 17 + 3} />
        </Slice>
      ))}

      {/* đèn MyMy thả lên */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {released.map((l) => (
            <motion.div
              key={l.id}
              className="absolute w-6"
              style={{ left: l.x - 12, top: l.y - 16 }}
              initial={{ opacity: 0, scale: 0.6, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.8, 0.5], y: -window.innerHeight * 0.75, x: [0, 10, -8, 6] }}
              transition={{ duration: 9, ease: "easeOut", times: [0, 0.1, 0.7, 1] }}
            >
              <SkyLanternShape />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* lời thì thầm theo đoạn đường */}
      <div className="pointer-events-none absolute inset-x-0 top-[26svh] flex justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          {(phase === "arrive" || phase === "dismount") && (
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 1.2 }}
              className="font-hand text-[21px] leading-[1.8] text-moon [text-shadow:0_2px_16px_rgba(6,8,30,0.9)] text-balance"
            >
              {phase === "arrive" ? w.arrive : w.intro}
            </motion.p>
          )}
          {phase === "walk" && caption >= 0 && (
            <motion.p
              key={caption}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 1.4 }}
              className="font-hand text-[21px] leading-[1.8] text-moon [text-shadow:0_2px_16px_rgba(6,8,30,0.9)] text-balance"
            >
              {w.captions[caption].text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

    </motion.section>
  );
}

function SkyLanternShape() {
  return (
    <svg viewBox="0 0 24 32" className="w-full" overflow="visible">
      <circle cx="12" cy="16" r="18" fill="#ffb54a" opacity="0.25" />
      <path d="M5 4 h14 l-2 22 h-10 z" fill="#ffb54a" />
      <path d="M8 6 h8 l-1 16 h-6 z" fill="#ffe6a4" opacity="0.8" />
      <rect x="8" y="26" width="8" height="2" fill="#8a4a1c" />
    </svg>
  );
}
