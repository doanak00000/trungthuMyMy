/**
 * Cấu hình chung cho cả trải nghiệm.
 * Muốn đổi tên, đèn, ảnh kỷ niệm, nhạc… thì sửa ở đây.
 */

export const couple = {
  her: "MyMy",
  him: "LuLu",
} as const;

/**
 * Ảnh mặt ghép vào đầu hai nhân vật khi đi rước đèn và trên cầu.
 * Ảnh vuông, mặt nằm giữa (web tự cắt tròn). Để null thì dùng đầu bóng giấy.
 */
export const faces: { her: string | null; him: string | null } = {
  her: "/faces/mymy.webp",
  him: "/faces/lulu2.webp",
};

export type LanternId = "star" | "rabbit" | "moon" | "flower" | "lulu";

export type LanternOption = {
  id: LanternId;
  name: string;
  /** Câu nhỏ hiện dưới đèn khi chọn */
  note: string;
  /** Màu giấy kiếng chính của đèn */
  color: string;
  /** Màu ánh sáng hắt ra xung quanh */
  glow: string;
};

export const lanterns: LanternOption[] = [
  { id: "star", name: "Đèn ông sao", note: "Cổ điển, sáng rực", color: "#e8472e", glow: "#ff8a4c" },
  { id: "rabbit", name: "Đèn thỏ ngọc", note: "Tai dài, hơi lém", color: "#f3e9ff", glow: "#d9c8ff" },
  { id: "moon", name: "Đèn trăng tròn", note: "Tròn như mặt trăng", color: "#ffc45c", glow: "#ffd98a" },
  { id: "flower", name: "Đèn hoa sen", note: "Nhẹ nhàng, dịu dàng", color: "#e0579a", glow: "#ff8cc0" },
  { id: "lulu", name: "Đèn của LuLu", note: "Chỉ có một cái thôi", color: "#ff5a6e", glow: "#ff9aa8" },
];

export const festivalConfig = {
  /** Cần ghé bao nhiêu chỗ trên phố thì LuLu mới xuất hiện rủ đi rước đèn */
  minVisitsToWalk: 3,
  /** Chạm bao nhiêu con đom đóm thì mở được bất ngờ */
  firefliesToCatch: 7,
  /** Thời gian đi rước đèn (giây) */
  walkDurationSeconds: 48,
};

/**
 * Quà trong hộp quà cuối cùng, mở lần lượt theo thứ tự. Sau cùng là lá thư (sửa trong data/messages.ts).
 * Muốn đổi ảnh: bỏ file vào /public/gifts rồi sửa `src` (nên dùng .webp/.jpg, rộng ~900px).
 */
export const gifts: { src: string; name: string; note: string; alt: string }[] = [
  {
    src: "/gifts/tulip.webp",
    name: "Một bó tulip",
    note: "Màu hồng, dịu dàng như em.",
    alt: "Những bông tulip hồng dưới bầu trời xanh",
  },
  {
    src: "/gifts/sunflower.webp",
    name: "Một bó hướng dương",
    note: "Để ngày nào em cũng hướng về phía có nắng.",
    alt: "Những bông hoa hướng dương vàng rực",
  },
];

/**
 * Góc nhỏ khi chạm vào mặt trăng: những điều hai đứa hẹn làm khi gặp nhau lần đầu.
 * Thêm/bớt/sửa thoải mái.
 */
export const promises: string[] = [
  "Gặp nhau lần đầu, không ai được ngại",
  "Cùng ăn chung một cái bánh trung thu",
  "Đi rước đèn thật, LuLu cầm đèn cho",
  "Ngồi ngắm trăng tới khuya",
  "Chụp tấm ảnh đầu tiên của hai đứa",
];

/**
 * Nhạc nền.
 * - Để `musicSrc: null` thì web tự chơi một đoạn nhạc ngũ cung nhẹ (tổng hợp bằng Web Audio, không tốn dung lượng).
 * - Muốn dùng bài riêng: bỏ file vào /public/audio (mp3/m4a, nên < 3MB) rồi ghi đường dẫn, ví dụ "/audio/rước-đèn.mp3".
 */
export const audioConfig = {
  musicSrc: null as string | null,
  volume: 0.6,
};
