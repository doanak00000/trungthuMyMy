/** Bàn tay chỉ xuống kèm vòng sóng: "chạm vào đây nè". Đặt ngay trên thứ cần chạm. */
export function TapIcon() {
  return (
    <svg viewBox="0 0 48 56" className="w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" overflow="visible">
      {/* vòng sóng ở đầu ngón tay */}
      <circle cx="34" cy="48" r="10" fill="none" stroke="#ffc45c" strokeWidth="2.5" opacity="0.8">
        <animate attributeName="r" values="4;14" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0" dur="1.1s" repeatCount="indefinite" />
      </circle>
      {/* bàn tay chỉ xuống */}
      <path
        d="M14 40 V14 a4 4 0 0 1 8 0 v10 a4 4 0 0 1 8 0 v2 a4 4 0 0 1 8 0 v2 a4 4 0 0 1 7 2 v9 c0 9 -6 15 -15 15 h-3 c-6 0 -10 -3 -13 -8 l-6 -10 a3.6 3.6 0 0 1 6 -4 z"
        fill="#fff4e0"
        stroke="#3b1206"
        strokeWidth="2.2"
        strokeLinejoin="round"
        transform="rotate(180 26 28)"
      />
    </svg>
  );
}
