/** Mặt trăng rằm: có bóng cây đa và chú Cuội mờ mờ, đúng kiểu chuyện kể Việt Nam. */
export function MoonArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="moon-face" cx="42%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="55%" stopColor="#ffe6a4" />
          <stop offset="100%" stopColor="#f3c671" />
        </radialGradient>
        <radialGradient id="moon-edge" cx="50%" cy="50%" r="50%">
          <stop offset="82%" stopColor="#fff3c9" stopOpacity="0" />
          <stop offset="100%" stopColor="#d99b45" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#moon-face)" />
      {/* biển trăng */}
      <g fill="#d9a85a" opacity="0.22">
        <ellipse cx="128" cy="70" rx="26" ry="18" />
        <ellipse cx="148" cy="112" rx="16" ry="22" />
        <ellipse cx="70" cy="58" rx="14" ry="10" />
        <circle cx="112" cy="146" r="9" />
        <circle cx="160" cy="80" r="5" />
      </g>
      {/* cây đa + chú Cuội */}
      <g fill="#b98138" opacity="0.28">
        <path d="M58 150c-2-14 1-26 4-34-10 2-22-3-26-12 8 3 16 1 20-4-10-2-17-10-17-19 9 7 18 7 24 3-4-7-3-16 3-22 1 9 6 14 12 15 1-9 8-15 16-16-4 7-3 14 1 19 7-4 16-3 21 3-8 0-13 5-14 11 8 1 14 7 14 14-7-5-15-5-21-1 3 7 2 15-3 20-1-8-5-13-10-15-3 9-4 22-2 38z" />
        <path d="M78 150c0-6 3-10 6-12l2-8c1-3 5-3 6 0l1 7 5 3c2 2 1 5-2 5h-4l1 5z" />
      </g>
      <circle cx="100" cy="100" r="96" fill="url(#moon-edge)" />
    </svg>
  );
}
