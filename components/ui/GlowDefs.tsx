/**
 * Quầng sáng mềm cho đèn trong các cảnh SVG (thay cho vòng tròn phẳng).
 * Đặt <GlowDefs /> trong mỗi <svg> rồi dùng fill={glow("#e8472e")}.
 */
const COLORS = [
  "#e8472e",
  "#ffa028",
  "#25b597",
  "#d8428f",
  "#ffc45c",
  "#ff8a4c",
  "#ff8cc0",
  "#9b8cff",
  "#6c5bd6",
  "#ffd47a",
];

export const glow = (color: string) => `url(#glow-${color.slice(1).toLowerCase()})`;

export function GlowDefs() {
  return (
    <defs>
      {COLORS.map((c) => (
        <radialGradient key={c} id={`glow-${c.slice(1)}`}>
          <stop offset="0" stopColor={c} stopOpacity="0.5" />
          <stop offset="0.4" stopColor={c} stopOpacity="0.16" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
      ))}
    </defs>
  );
}
