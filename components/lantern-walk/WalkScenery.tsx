/**
 * Cảnh đi rước đèn, chia thành từng đoạn 1200 × 800 để điện thoại chỉ phải vẽ phần đang thấy.
 * Thứ tự: phố đèn → lối hoa → bờ sông → đồng trăng → tới cầu → bờ bên kia.
 * Chân nhân vật đứng ở y = 620.
 */
import { LanternString, rand } from "@/components/festival/StreetScenery";
import { glow } from "@/components/ui/GlowDefs";

export const SEG_W = 1200;
export const GROUND_Y = 620;
/** Vị trí (đơn vị thế giới) mà hai đứa dừng lại — ngay chân cầu */
export const BRIDGE_STOP = 5160;

const INK = "#080a24";
const FAR = "#111647";

function Ground({ tone = "#0d1036" }: { tone?: string }) {
  return (
    <g>
      <rect x="-2" y={GROUND_Y} width={SEG_W + 4} height={800 - GROUND_Y} fill={tone} />
      <rect x="-2" y={GROUND_Y - 2} width={SEG_W + 4} height="4" fill="#262c78" opacity="0.7" />
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse key={i} cx={i * 80 + rand(i) * 40} cy={GROUND_Y + 22 + rand(i + 4) * 30} rx={14 + rand(i + 8) * 18} ry="2.5" fill="#1a1f5a" opacity="0.6" />
      ))}
    </g>
  );
}

function House({ x, w, top, seed }: { x: number; w: number; top: number; seed: number }) {
  const rows = Math.floor((GROUND_Y - top - 80) / 60);
  return (
    <g>
      <path
        d={`M${x} ${GROUND_Y} V${top + 24} L${x - 10} ${top + 24} Q${x + w * 0.2} ${top + 8} ${x + w / 2} ${top} Q${x + w * 0.8} ${top + 8} ${x + w + 10} ${top + 24} L${x + w} ${top + 24} V${GROUND_Y} Z`}
        fill="#0b0e2e"
      />
      {Array.from({ length: rows }, (_, r) => (
        <rect
          key={r}
          x={x + w / 2 - 10}
          y={top + 50 + r * 60}
          width="20"
          height="28"
          rx="10"
          fill={rand(seed + r) > 0.3 ? "#ffb957" : "#1b2058"}
          opacity="0.75"
        />
      ))}
    </g>
  );
}

function GlowFlower({ x, y, color, r = 5 }: { x: number; y: number; color: string; r?: number }) {
  return (
    <g>
      <path d={`M${x} ${y} q ${r / 2} ${r * 3} 0 ${GROUND_Y - y}`} stroke="#12305a" strokeWidth="1.6" fill="none" />
      <circle cx={x} cy={y} r={r * 6} fill={glow(color)} />
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={x} cy={y - r} rx={r * 0.6} ry={r} fill={color} transform={`rotate(${i * 72} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r={r * 0.5} fill="#fff4d0" />
    </g>
  );
}

function Water({ from = 650 }: { from?: number }) {
  return (
    <g>
      <rect x="-2" y={from} width={SEG_W + 4} height={800 - from} fill="#0c1348" />
      <rect x="-2" y={from} width={SEG_W + 4} height="3" fill="#2d3590" opacity="0.8" />
      <g className="anim-ripple">
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={i * 56 + rand(i + 30) * 30} y={from + 20 + (i % 5) * 26} width={10 + rand(i + 3) * 30} height="2" rx="1" fill="#8a93e0" opacity="0.3" />
        ))}
      </g>
    </g>
  );
}

/** Đèn hoa đăng trôi trên sông */
function WaterLantern({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <g className="anim-bob" style={{ animationDelay: `${delay}s`, transformBox: "fill-box" }}>
      <circle cx={x} cy={y - 8} r="44" fill={glow(color)} />
      <path d={`M${x - 16} ${y} q 16 8 32 0 l -6 -6 h -20 z`} fill="#ffb3c6" />
      <path d={`M${x} ${y - 22} c 6 6 6 14 0 18 c -6 -4 -6 -12 0 -18 z`} fill={color} />
      <circle cx={x} cy={y - 6} r="3" fill="#fff4d0" />
      {/* bóng dưới nước */}
      <rect x={x - 10} y={y + 8} width="20" height="2" rx="1" fill={color} opacity="0.5" />
      <rect x={x - 6} y={y + 14} width="12" height="2" rx="1" fill={color} opacity="0.3" />
    </g>
  );
}

export function StreetSeg() {
  return (
    <g>
      {[
        { x: 40, w: 110, top: 300 },
        { x: 160, w: 90, top: 350 },
        { x: 380, w: 120, top: 280 },
        { x: 520, w: 90, top: 330 },
        { x: 760, w: 110, top: 310 },
        { x: 890, w: 100, top: 360 },
        { x: 1080, w: 90, top: 400 },
      ].map((h, i) => (
        <House key={h.x} {...h} seed={i * 11} />
      ))}
      <LanternString x1={-20} x2={390} y={260} sag={50} seed={11} count={8} />
      <LanternString x1={390} x2={780} y={250} sag={60} seed={12} count={8} />
      <LanternString x1={780} x2={1220} y={300} sag={46} seed={13} count={8} />
      <Ground />
    </g>
  );
}

export function FlowerSeg() {
  const colors = ["#d8428f", "#9b8cff", "#ffd47a", "#ff8cc0", "#6c5bd6"];
  return (
    <g>
      {/* bụi cây tròn */}
      {[80, 300, 560, 820, 1060].map((x, i) => (
        <path
          key={x}
          d={`M${x - 90} ${GROUND_Y} C ${x - 100} ${GROUND_Y - 80} ${x - 30} ${GROUND_Y - 130} ${x + 10} ${GROUND_Y - 100} C ${x + 60} ${GROUND_Y - 140} ${x + 120} ${GROUND_Y - 70} ${x + 100} ${GROUND_Y} Z`}
          fill={i % 2 ? "#0a0d2c" : INK}
        />
      ))}
      {/* hàng rào tre */}
      <g stroke="#141a4a" strokeWidth="5">
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={i * 62 + 10} y1={GROUND_Y} x2={i * 62 + 10} y2={GROUND_Y - 46} />
        ))}
        <line x1="0" y1={GROUND_Y - 34} x2={SEG_W} y2={GROUND_Y - 34} strokeWidth="3" />
      </g>
      {Array.from({ length: 26 }, (_, i) => (
        <GlowFlower key={i} x={20 + i * 46 + rand(i + 50) * 20} y={GROUND_Y - 20 - rand(i + 60) * 70} color={colors[i % colors.length]} r={4 + rand(i + 70) * 3} />
      ))}
      {/* cột đèn */}
      <g>
        <rect x="640" y="380" width="6" height="240" fill="#141a4a" />
        <path d="M630 380 h26 l-4 -14 h-18 z" fill="#141a4a" />
        <circle cx="643" cy="392" r="70" fill={glow("#ffc45c")} />
        <ellipse cx="643" cy="392" rx="9" ry="11" fill="#ffc45c" />
      </g>
      <Ground tone="#0c1134" />
    </g>
  );
}

export function RiverSeg() {
  const colors = ["#ffc45c", "#ff8cc0", "#e8472e", "#25b597"];
  return (
    <g>
      {/* bờ bên kia xa xa */}
      <path d={`M0 470 C 200 450 400 480 600 460 C 800 440 1000 470 1200 455 V520 H0 Z`} fill={FAR} />
      <g fill="#ffb957" opacity="0.4">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={40 + i * 100} cy={470 + rand(i + 90) * 20} r="2.5" />
        ))}
      </g>
      <rect x="-2" y="520" width={SEG_W + 4} height="100" fill="#0c1348" />
      <g className="anim-ripple">
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i} x={i * 70 + rand(i + 5) * 30} y={535 + (i % 4) * 18} width={10 + rand(i + 7) * 30} height="2" rx="1" fill="#ffb957" opacity="0.28" />
        ))}
      </g>
      {/* lan can bờ kè ngay sau lối đi */}
      <g stroke="#1e2466" strokeWidth="4">
        <line x1="0" y1={GROUND_Y - 30} x2={SEG_W} y2={GROUND_Y - 30} />
        {Array.from({ length: 25 }, (_, i) => (
          <line key={i} x1={i * 50} y1={GROUND_Y} x2={i * 50} y2={GROUND_Y - 30} />
        ))}
      </g>
      <rect x="-2" y={GROUND_Y} width={SEG_W + 4} height="30" fill="#0d1036" />
      <rect x="-2" y={GROUND_Y - 2} width={SEG_W + 4} height="4" fill="#262c78" opacity="0.7" />
      <Water from={650} />
      {Array.from({ length: 7 }, (_, i) => (
        <WaterLantern key={i} x={80 + i * 170} y={560 + (i % 3) * 14} color={colors[i % colors.length]} delay={-i * 0.7} />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <WaterLantern key={`n${i}`} x={140 + i * 230} y={720 + (i % 2) * 30} color={colors[(i + 2) % colors.length]} delay={-i * 1.1} />
      ))}
    </g>
  );
}

export function LandSeg() {
  return (
    <g>
      <path d="M0 540 C 150 500 300 520 450 490 C 600 460 800 510 950 480 C 1050 460 1150 490 1200 480 V620 H0 Z" fill={FAR} />
      <path d="M0 580 C 200 560 350 590 600 560 C 850 530 1000 580 1200 560 V620 H0 Z" fill="#0c1040" />
      {/* cây đứng một mình */}
      {[
        [220, 1],
        [760, 1.3],
        [1040, 0.8],
      ].map(([x, s]) => (
        <g key={x} transform={`translate(${x} ${GROUND_Y}) scale(${s})`}>
          <path d="M-6 0 C -4 -40 -8 -70 -4 -110 L6 -110 C 8 -70 6 -40 8 0 Z" fill={INK} />
          <path d="M-70 -110 C -80 -150 -40 -190 0 -180 C 30 -210 90 -180 80 -140 C 110 -120 90 -90 60 -96 C 30 -80 -30 -84 -50 -96 C -80 -92 -86 -104 -70 -110 Z" fill={INK} />
        </g>
      ))}
      {/* cỏ lau cao */}
      <g stroke="#141a4a" strokeWidth="2" fill="none">
        {Array.from({ length: 40 }, (_, i) => {
          const x = i * 30 + rand(i + 120) * 20;
          const h = 30 + rand(i + 130) * 40;
          return <path key={i} d={`M${x} ${GROUND_Y} q ${rand(i) * 8 - 4} ${-h / 2} ${rand(i + 1) * 10 - 2} ${-h}`} />;
        })}
      </g>
      <Ground tone="#0c1036" />
    </g>
  );
}

/** Đoạn cuối: bờ nước, cây cầu vòm đỏ nhỏ bắc qua (kiểu cầu Thê Húc) */
export function BridgeSeg() {
  return (
    <g>
      <path d="M0 520 C 200 500 400 530 700 500 C 900 480 1100 510 1200 500 V560 H0 Z" fill={FAR} />
      <rect x="-2" y="560" width={SEG_W + 4} height="240" fill="#0c1348" />
      <g className="anim-ripple">
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={i * 52 + rand(i + 200) * 30} y={600 + (i % 6) * 30} width={10 + rand(i + 210) * 30} height="2" rx="1" fill="#8a93e0" opacity="0.3" />
        ))}
      </g>
      {/* đất tới chân cầu */}
      <path d={`M-2 ${GROUND_Y} H440 C 470 ${GROUND_Y} 480 ${GROUND_Y + 40} 470 800 H-2 Z`} fill="#0d1036" />
      <rect x="-2" y={GROUND_Y - 2} width="444" height="4" fill="#262c78" opacity="0.7" />
      {/* cầu vòm */}
      <g>
        <path d="M430 628 Q 700 480 970 628 L 970 646 Q 700 500 430 646 Z" fill="#b8200f" />
        <path d="M430 628 Q 700 480 970 628" stroke="#e8472e" strokeWidth="4" fill="none" />
        <g stroke="#b8200f" strokeWidth="5">
          {Array.from({ length: 11 }, (_, i) => {
            const t = (i + 0.5) / 11;
            const x = 430 + 540 * t;
            const y = (1 - t) * (1 - t) * 628 + 2 * (1 - t) * t * 480 + t * t * 628;
            return <line key={i} x1={x} y1={y} x2={x} y2={y - 34} />;
          })}
        </g>
        <path d="M430 594 Q 700 446 970 594" stroke="#e8472e" strokeWidth="4" fill="none" />
        {/* bóng cầu dưới nước */}
        <path d="M430 660 Q 700 800 970 660" stroke="#b8200f" strokeWidth="6" fill="none" opacity="0.3" className="anim-ripple" />
        {/* đèn ở hai đầu cầu */}
        {[430, 970].map((x) => (
          <g key={x}>
            <rect x={x - 4} y="560" width="8" height="70" fill="#8a2412" />
            <circle cx={x} cy="556" r="52" fill={glow("#ffc45c")} />
            <ellipse cx={x} cy="556" rx="9" ry="11" fill="#ffc45c" />
          </g>
        ))}
      </g>
      <path d={`M960 ${GROUND_Y + 8} C 1000 ${GROUND_Y} 1100 ${GROUND_Y} 1202 ${GROUND_Y} V800 H980 Z`} fill="#0d1036" />
    </g>
  );
}

export function FarBankSeg() {
  return (
    <g>
      <path d="M0 520 C 300 490 600 520 900 490 C 1000 480 1100 500 1200 490 V620 H0 Z" fill={FAR} />
      <LandSeg />
    </g>
  );
}

/** Đồi xa, trôi rất chậm */
export function FarHills() {
  return (
    <g>
      <path d="M0 520 C 120 440 260 430 380 480 C 480 420 620 400 760 470 C 880 430 1000 440 1200 500 V800 H0 Z" fill="#0e1240" />
      <g fill="#ffb957" opacity="0.35">
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={40 + i * 120 + rand(i + 300) * 40} cy={500 + rand(i + 310) * 20} r="2" />
        ))}
      </g>
    </g>
  );
}

/** Cỏ và hoa sát ống kính, trôi nhanh hơn để có chiều sâu */
export function Foreground({ seed }: { seed: number }) {
  return (
    <g fill="#03040f">
      {Array.from({ length: 7 }, (_, i) => {
        const x = i * 170 + rand(seed + i) * 90;
        const blades = 5 + Math.floor(rand(seed + i + 20) * 4);
        return (
          <g key={i}>
            {Array.from({ length: blades }, (_, j) => {
              const bx = x + j * 9 - blades * 4;
              const h = 34 + rand(seed + i * 7 + j) * 52;
              const lean = (j - blades / 2) * 7 + (rand(seed + j) - 0.5) * 10;
              return (
                <path
                  key={j}
                  d={`M${bx - 3} 800 Q ${bx + lean * 0.3} ${800 - h * 0.6} ${bx + lean} ${800 - h} Q ${bx + lean * 0.2} ${800 - h * 0.5} ${bx + 3} 800 Z`}
                />
              );
            })}
            {rand(seed + i + 80) > 0.5 && <circle cx={x + 4} cy={800 - 70 - rand(seed + i) * 20} r="3.5" fill="#d8428f" opacity="0.85" />}
          </g>
        );
      })}
    </g>
  );
}
