"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { StoryProvider, useStory } from "@/components/story/StoryContext";
import { NightSky, SkyHitLayer } from "@/components/sky/NightSky";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { MoonIntro } from "@/components/intro/MoonIntro";
import { Ticket } from "@/components/ticket/Ticket";
import { LanternPicker } from "@/components/lantern/LanternPicker";
import { CompanionLantern } from "@/components/lantern/CompanionLantern";
import dynamic from "next/dynamic";
import { Fireflies } from "@/components/easter-eggs/Fireflies";
import { EasterEggSheets } from "@/components/easter-eggs/EasterEggSheets";
import { getAudio } from "@/lib/audio";

// Các màn sau được tải dần (lazy) để lần mở đầu tiên thật nhẹ trên 4G.
const loadFestival = () => import("@/components/festival/FestivalStreet").then((m) => m.FestivalStreet);
const loadWalk = () => import("@/components/lantern-walk/LanternWalk").then((m) => m.LanternWalk);
const loadBridge = () => import("@/components/gift/BridgeScene").then((m) => m.BridgeScene);
const loadGift = () => import("@/components/gift/GiftScene").then((m) => m.GiftScene);
const FestivalStreet = dynamic(loadFestival, { ssr: false });
const LanternWalk = dynamic(loadWalk, { ssr: false });
const BridgeScene = dynamic(loadBridge, { ssr: false });
const GiftScene = dynamic(loadGift, { ssr: false });

function Stage() {
  const { scene } = useStory();
  const [introStage, setIntroStage] = useState(0);

  // Âm thanh chỉ bắt đầu sau lần chạm đầu tiên.
  useEffect(() => {
    const unlock = () => getAudio().unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    if (scene === "intro") setIntroStage(0);
    // tải trước màn kế tiếp trong lúc MyMy đang đọc
    if (scene === "ticket" || scene === "lantern") void loadFestival();
    if (scene === "festival") void Promise.all([loadWalk(), loadBridge(), loadGift()]);
  }, [scene]);

  const withFireflies = scene === "festival" || scene === "walk" || scene === "bridge";

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <NightSky introStage={scene === "intro" ? introStage : 9} />

      <AnimatePresence mode="wait">
        {scene === "intro" && <MoonIntro key="intro" stage={introStage} setStage={setIntroStage} />}
        {scene === "ticket" && <Ticket key="ticket" />}
        {scene === "lantern" && <LanternPicker key="lantern" />}
        {scene === "festival" && <FestivalStreet key="festival" />}
        {scene === "walk" && <LanternWalk key="walk" />}
        {scene === "bridge" && <BridgeScene key="bridge" />}
        {scene === "gift" && <GiftScene key="gift" />}
      </AnimatePresence>

      <AnimatePresence>{scene === "festival" && <CompanionLantern key="companion" />}</AnimatePresence>
      {withFireflies && <Fireflies key={scene} count={scene === "festival" ? 9 : 6} band={scene === "festival" ? [30, 70] : [30, 62]} />}

      <SkyHitLayer />
      <SoundToggle />
      <EasterEggSheets />
    </main>
  );
}

export function Experience() {
  return (
    <MotionConfig reducedMotion="user">
      <StoryProvider>
        <Stage />
      </StoryProvider>
    </MotionConfig>
  );
}
