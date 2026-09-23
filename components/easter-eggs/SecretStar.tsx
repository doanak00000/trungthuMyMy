"use client";

import { useStory } from "@/components/story/StoryContext";
import { getAudio } from "@/lib/audio";

/** Một ngôi sao hơi hồng, sáng hơn mấy ngôi khác một chút. Ai tinh mắt mới thấy. */
export function SecretStar() {
  const { setOverlay } = useStory();
  return (
    <button
      type="button"
      aria-label="Một ngôi sao sáng"
      onClick={() => {
        getAudio().bell(1.5);
        setOverlay("star");
      }}
      className="pointer-events-auto absolute left-[9%] top-[13vh] grid size-11 place-items-center"
    >
      <svg viewBox="0 0 24 24" className="anim-shimmer size-5 drop-shadow-[0_0_6px_rgba(255,190,220,0.9)]">
        <path
          d="M12 1.5c.6 5.2 2.2 8.4 10.5 10.5C14.2 14.1 12.6 17.3 12 22.5 11.4 17.3 9.8 14.1 1.5 12 9.8 9.9 11.4 6.7 12 1.5z"
          fill="#ffe3f0"
        />
      </svg>
    </button>
  );
}
