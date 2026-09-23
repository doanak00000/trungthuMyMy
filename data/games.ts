/**
 * Khu trò chơi trên phố đèn. Sửa chữ, độ khó, quà, lời thăm ở đây.
 */
import { couple } from "./festival";

const { her, him } = couple;

export const games = {
  label: "Chơi game trúng thưởng",
  heading: "Khu trò chơi",
  banner: {
    title: "Chơi game trúng thưởng!",
    prizes: ["3 cá xịn liên tiếp: 200k xu", "Gắp được thú bông: 349 ngọc", "Rút trúng thăm may mắn: 349 ngọc"],
    rule: (plays: number) => `Mỗi trò được chơi ${plays} lượt. Trúng thưởng trò nào thì trò đó dừng nha.`,
  },
  /** Mỗi trò được chơi lại tối đa mấy lần (lưu trên máy người chơi) */
  maxReplays: 2,
  playsLeft: (n: number) => `Còn ${n} lượt`,
  locked: {
    won: "Em trúng thưởng trò này rồi. Nhớ chụp màn hình gửi LuLu nha!",
    out: "Hết lượt chơi trò này rồi. Thử trò khác đi em.",
  },
  tabs: {
    fish: "Vớt cá",
    claw: "Gắp thú",
    fortune: "Rút thăm",
  },
  again: "Chơi lại",

  /** Vớt cá bằng vợt giấy: mỗi lần vớt vợt yếu đi, rách là hết lượt. */
  fishing: {
    hint: "Chạm vào con cá để vớt",
    /** Vớt liền bao nhiêu con cá xịn (không dính cá thối) thì có thưởng */
    streakForReward: 3,
    /** Vớt được mấy lần thì vợt giấy rách */
    netLife: 6,
    /** Tỉ lệ vớt phải cá thối (0–1). Cá nào thối là ngẫu nhiên, nhìn ngoài không biết được. */
    rottenRate: 0.45,
    fishCount: 6,
    good: "Cá xịn! Vớt giỏi ghê.",
    rotten: "My thúi ngốc gắp phải cá thối rồi",
    netLabel: "Vợt giấy",
    torn: (good: number, rotten: number) =>
      `Vợt rách rồi. Được ${good} cá xịn${rotten ? ` và ${rotten} con cá thối` : ""}.${good >= 4 ? " Giỏi ghê!" : ""}`,
    bag: "Túi cá",
  },

  /** Máy gắp thú: móc chạy qua lại, bấm Gắp đúng lúc để móc trúng thú bông. */
  claw: {
    hint: "Canh móc ngay trên thú rồi bấm Gắp",
    grab: "Gắp",
    tries: 5,
    /** Độ rộng vùng trúng quanh mỗi con thú (0–1). Lớn hơn = dễ hơn. */
    tolerance: 0.075,
    /** Móc trúng rồi vẫn có thể tuột tay (0–1). */
    slipRate: 0.3,
    toys: [
      { id: "bear", name: "Gấu" },
      { id: "bunny", name: "Thỏ" },
      { id: "cat", name: "Mèo" },
      { id: "duck", name: "Vịt" },
    ],
    got: "Gắp được rồi!",
    slipped: "Tuột mất rồi, tiếc ghê",
    miss: "Trượt rồi…",
    done: (won: number) => (won === 0 ? "Hết lượt rồi. Máy này khó thiệt đó." : `Hết lượt rồi. Em gắp được ${won} con!`),
    triesLeft: (n: number) => `Còn ${n} lượt`,
  },

  /** Rút thăm may mắn: mỗi lần rút ra một câu ngẫu nhiên. Thêm câu thoải mái. */
  fortune: {
    hint: "Lắc hũ rồi rút một thăm",
    draw: "Rút một thăm",
    drawAgain: "Rút thăm khác",
    slips: [
      "Đại cát: tuần này chân mau khỏi, chạy nhảy tung tăng.",
      `Được ${him} cưng gấp đôi trong suốt mùa trăng.`,
      "Sắp được gặp một người đặc biệt. Người đó đang đọc câu này cùng em đấy.",
      "Ăn bánh trung thu không béo. Thật đó, thăm nói vậy.",
      `Mỗi tối nhìn trăng là có một ${him} nhớ em.`,
      "Có quà bất ngờ trên đường tới. Cứ chờ đi.",
      `${her} cười một cái, cả phố đèn sáng thêm một chút.`,
      "Ước gì được nấy. Nhưng ước nhỏ nhỏ thôi nha.",
    ],
    /** Lá thăm trúng thưởng, trộn chung với các lá trên */
    jackpot: "Trúng thưởng!",
  },

  /** Phần thưởng (vật phẩm game). Sửa số lượng thoải mái. */
  rewards: {
    title: "Phần thưởng",
    claimNote: "Chụp màn hình gửi LuLu để được ghi nhận nha.",
    claim: "Nhận",
    fishStreak: { reason: "3 con cá xịn liên tiếp!", prize: "200k xu" },
    claw: { reason: "Gắp được thú bông!", prize: "349 ngọc" },
    fortune: { reason: "Rút trúng thăm may mắn!", prize: "349 ngọc" },
  },
};
