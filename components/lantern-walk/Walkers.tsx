import { useId } from "react";
import { faces, type LanternId } from "@/data/festival";
import { LanternArt } from "@/components/lantern/LanternArt";

const INK = "#05071a";

/**
 * MyMy và LuLu dạng bóng giấy, nắm tay nhau, mỗi người cầm một chiếc đèn.
 * Đi về phía bên phải. viewBox 220 × 230, chân chạm đất ở y ≈ 222.
 */
export function Walkers({
  herLantern,
  walking,
  withHim = true,
  className = "",
}: {
  herLantern: LanternId;
  walking: boolean;
  /** false: MyMy đứng một mình chờ LuLu tới */
  withHim?: boolean;
  className?: string;
}) {
  const hisLantern: LanternId = herLantern === "star" ? "moon" : "star";
  const uid = useId().replace(/:/g, "");
  return (
    <div className={`relative aspect-[220/230] ${walking ? "walking" : ""} ${className}`}>
      <svg viewBox="0 0 220 230" className="absolute inset-0 size-full" aria-hidden overflow="visible">
        <g className="body-bob">
          {/* ---- LuLu ---- */}
          <g style={{ opacity: withHim ? 1 : 0, transition: "opacity 0.6s ease" }}>
          <g fill={INK}>
            <rect className="leg-b" x="64" y="140" width="13" height="80" rx="6" />
            <rect className="leg-a" x="73" y="140" width="13" height="80" rx="6" />
            <path d="M58 78 Q72 72 86 78 L92 146 H54 Z" />
            <rect x="67" y="68" width="10" height="12" />
            {!faces.him && (
              <>
                <circle cx="72" cy="56" r="17" />
                {/* tóc ngắn, mái hơi vểnh */}
                <path d="M54 54 C 52 34, 88 30, 91 50 C 94 44, 92 40, 90 38 C 84 30, 64 30, 56 40 Z" />
              </>
            )}
          </g>
          {faces.him && <PhotoHead id={`him-${uid}`} src={faces.him} cx={72} cy={50} r={22} />}
          <g stroke={INK} strokeWidth="9" strokeLinecap="round" fill="none">
            <path d="M85 84 Q 100 116 112 138" />
            <path d="M60 84 Q 48 106 42 126" />
          </g>
          {/* cán đèn của LuLu */}
          <path d="M42 126 L 8 78" stroke="#3a2a12" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* ---- MyMy ---- */}
          <g fill={INK}>
            <rect className="leg-a" x="142" y="164" width="10" height="56" rx="5" />
            <rect className="leg-b" x="151" y="164" width="10" height="56" rx="5" />
            <path d="M141 94 Q150 88 159 94 L174 170 H126 Z" />
            <rect x="146" y="86" width="8" height="10" />
            {/* tóc dài bay nhẹ ra sau */}
            <path d="M136 70 C 128 92, 126 114, 118 132 C 132 130, 142 118, 146 96 Z" />
            {!faces.her && (
              <>
                <circle cx="150" cy="74" r="15" />
                <path d="M135 72 C 134 56, 164 54, 166 70 C 160 62, 144 60, 135 72 Z" />
              </>
            )}
          </g>
          {faces.her && <PhotoHead id={`her-${uid}`} src={faces.her} cx={150} cy={70} r={20} />}
          {/* nơ hồng trên tóc */}
          <g transform={faces.her ? "translate(-3 -8)" : undefined}>
            <path d="M137 60 l-8 -5 l1 10 z M137 60 l8 -6 l-1 11 z" fill="#ff5fa2" />
            <circle cx="137" cy="60" r="2.2" fill="#ffb3d1" />
          </g>
          <g stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none">
            {withHim ? <path d="M143 100 Q 126 124 114 139" /> : <path d="M143 100 Q 136 122 136 140" />}
            <path d="M158 100 Q 170 118 178 132" />
          </g>
          {/* hai bàn tay nắm nhau */}
          {withHim && <circle cx="113" cy="139" r="6" fill={INK} />}
          {/* cán đèn của MyMy */}
          <path d="M178 132 L 214 92" stroke="#3a2a12" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>

      {/* đèn: treo ở đầu cán, đung đưa theo bước chân */}
      <div className="absolute left-[3.6%] top-[33.9%] w-[18%] -translate-x-1/2 transition-opacity duration-700" style={{ opacity: withHim ? 1 : 0 }}>
        <div className="anim-sway origin-top" style={{ animationDuration: "2.2s" }}>
          <LanternArt id={hisLantern} className="w-full translate-y-[28%]" />
        </div>
      </div>
      <div className="absolute left-[97.3%] top-[40%] w-[20%] -translate-x-1/2">
        <div className="anim-sway origin-top" style={{ animationDuration: "2.2s", animationDelay: "-0.8s" }}>
          <LanternArt id={herLantern} className="w-full translate-y-[28%]" />
        </div>
      </div>
    </div>
  );
}

/** Đầu bằng ảnh thật, cắt tròn, viền sáng như được đèn lồng soi. */
export function PhotoHead({ id, src, cx, cy, r }: { id: string; src: string; cx: number; cy: number; r: number }) {
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r + 1.6} fill="#ffe6a4" opacity="0.85" />
      <image href={src} x={cx - r} y={cy - r} width={r * 2} height={r * 2} clipPath={`url(#${id})`} preserveAspectRatio="xMidYMid slice" />
    </g>
  );
}
