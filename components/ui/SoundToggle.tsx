"use client";

import { useEffect, useState } from "react";
import { getAudio } from "@/lib/audio";
import { messages } from "@/data/messages";

export function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    const audio = getAudio();
    setOn(audio.enabled);
    return audio.subscribe(setOn);
  }, []);

  return (
    <button
      type="button"
      onClick={() => getAudio().toggle()}
      aria-label={on ? messages.sound.on : messages.sound.off}
      aria-pressed={on}
      className="fixed right-[max(12px,env(safe-area-inset-right))] top-[max(12px,env(safe-area-inset-top))] z-50 grid size-11 place-items-center rounded-full bg-shadow/40 text-cloud/80 backdrop-blur-[2px] transition-colors hover:text-glow"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" fillOpacity="0.15" />
        {on ? (
          <>
            <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
            <path d="M18 6.8a7.4 7.4 0 0 1 0 10.4" opacity="0.6" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
    </button>
  );
}
