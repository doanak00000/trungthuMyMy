"use client";

import { motion } from "framer-motion";
import { useStory, type Scene } from "@/components/story/StoryContext";
import { MoonArt } from "./Moon";
import { StarField } from "./StarField";
import { SecretStar } from "@/components/easter-eggs/SecretStar";

type MoonPose = { x: string; y: string; scale: number; glow: number; opacity: number };

/** Vị trí mặt trăng theo từng cảnh. Mặt trăng là một nhân vật đi theo cả buổi tối. */
const POSES: Record<Scene, MoonPose> = {
  intro: { x: "0vw", y: "4vh", scale: 1, glow: 0.8, opacity: 1 },
  ticket: { x: "24vw", y: "-4vh", scale: 0.42, glow: 0.5, opacity: 0.9 },
  lantern: { x: "-22vw", y: "-4vh", scale: 0.38, glow: 0.5, opacity: 0.9 },
  festival: { x: "22vw", y: "-5vh", scale: 0.36, glow: 0.55, opacity: 1 },
  walk: { x: "18vw", y: "-3vh", scale: 0.42, glow: 0.6, opacity: 1 },
  bridge: { x: "0vw", y: "22vh", scale: 0.7, glow: 0.9, opacity: 1 },
  gift: { x: "0vw", y: "-2vh", scale: 0.86, glow: 1, opacity: 1 },
};

const CLICKABLE: Scene[] = ["lantern", "festival", "walk", "bridge"];
const SECRET_STAR: Scene[] = ["festival", "walk", "bridge"];

export function NightSky({ introStage = 3 }: { introStage?: number }) {
  const { scene } = useStory();
  const pose = POSES[scene];
  const inIntro = scene === "intro";
  const moonVisible = !inIntro || introStage >= 1;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* nền trời: chàm đậm ở trên, ấm dần về chân trời */}
      <div
        className="absolute inset-0 transition-opacity duration-[2500ms]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 110%, #2a1f5c 0%, #161b52 38%, #0a0d2c 70%, #06081e 100%)",
          opacity: inIntro && introStage < 1 ? 0.35 : 1,
        }}
      />
      <StarField visible={!inIntro || introStage >= 2} />

      {/* mặt trăng */}
      <MoonFrame pose={pose} visible={moonVisible} slow={inIntro}>
        <motion.div
          className="absolute -inset-[35%] rounded-full"
          animate={{ opacity: pose.glow }}
          transition={{ duration: 2.4 }}
          style={{
            background:
              "radial-gradient(circle, rgba(255,222,150,0.42) 0%, rgba(255,196,92,0.16) 32%, rgba(255,196,92,0) 62%)",
          }}
        />
        <MoonArt className="relative size-full drop-shadow-[0_0_40px_rgba(255,214,140,0.35)]" />
      </MoonFrame>

      {/* mây mỏng trôi ngang, mép mềm */}
      <motion.div
        className="absolute left-0 top-[22vh] h-[16vh] w-[240vw]"
        initial={{ x: "-60vw" }}
        animate={{ x: "0vw" }}
        transition={{ duration: 120, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
        style={{
          background: [
            "radial-gradient(ellipse 18% 38% at 22% 55%, rgba(58,64,150,0.45), transparent 70%)",
            "radial-gradient(ellipse 14% 30% at 30% 45%, rgba(70,76,170,0.35), transparent 70%)",
            "radial-gradient(ellipse 22% 34% at 62% 60%, rgba(52,58,140,0.4), transparent 70%)",
            "radial-gradient(ellipse 12% 26% at 70% 48%, rgba(80,86,180,0.3), transparent 70%)",
          ].join(","),
        }}
      />
    </div>
  );
}

/** Lớp chạm nằm trên các cảnh: mặt trăng và ngôi sao bí mật vẫn bấm được dù cảnh phủ lên trên. */
export function SkyHitLayer() {
  const { scene, setOverlay } = useStory();
  const clickable = CLICKABLE.includes(scene);
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {clickable && (
        <MoonFrame pose={POSES[scene]} visible slow={false}>
          <button
            type="button"
            aria-label="Mặt trăng"
            onClick={() => setOverlay("promises")}
            className="pointer-events-auto absolute inset-[6%] rounded-full"
          />
        </MoonFrame>
      )}
      {SECRET_STAR.includes(scene) && <SecretStar />}
    </div>
  );
}

function MoonFrame({
  pose,
  visible,
  slow,
  children,
}: {
  pose: MoonPose;
  visible: boolean;
  slow: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute left-1/2 top-[6vh] -translate-x-1/2">
      <motion.div
        initial={false}
        animate={{
          x: pose.x,
          y: visible ? pose.y : "18vh",
          scale: pose.scale,
          opacity: visible ? pose.opacity : 0,
        }}
        transition={{ duration: slow ? 4.2 : 2.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 0 }}
        className="relative size-[min(78vmin,460px)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
