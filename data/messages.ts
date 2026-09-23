/**
 * Toàn bộ lời nhắn trong web nằm ở đây.
 * Sửa chữ thoải mái, giữ nguyên cấu trúc (dấu ngoặc, dấu phẩy) là được.
 */
import { couple } from "./festival";

const { her, him } = couple;

export const messages = {
  meta: {
    title: `Trung Thu này, ${him} đưa ${her} đi chơi`,
    description: `Một đêm Trung Thu nhỏ ${him} làm riêng cho ${her}.`,
  },

  intro: {
    lines: [
      `${her} ơi...`,
      "Năm nay chân em đau nên không đi rước đèn được...",
      "Nhưng ai bảo Trung Thu là phải đi ngoài đường?",
    ],
    reveal: `${him} có một nơi muốn đưa em đi.`,
    cta: "Đi thôi",
  },

  ticket: {
    heading: "Vé rước đèn đặc biệt",
    serial: "Số 15 · Tháng Tám",
    fields: [
      { label: "Người nhận", value: her },
      { label: "Người đi cùng", value: `${him} ❤️` },
      { label: "Địa điểm", value: "Một nơi chỉ hai đứa biết" },
      { label: "Thời gian", value: "Tối Trung Thu" },
    ],
    statusLabel: "Trạng thái",
    status: "Đã giữ chỗ mãi mãi",
    stamp: "Đã giữ chỗ",
    cta: "Nhận vé",
  },

  lantern: {
    heading: "Chọn một chiếc đèn",
    sub: "Đèn này sẽ theo em suốt tối nay.",
    picked: `“Đèn này hợp với ${her} ghê.”`,
    cta: "Cầm đèn",
  },

  festival: {
    enterHint: "Vuốt sang để dạo phố",
    tapHint: "Chỗ nào sáng thì chạm vào nha",
    gateSign: "Phố Đèn",
    labels: {
      mooncake: "Tiệm bánh",
      lion: "Múa lân",
      rabbit: "Thỏ Ngọc",
      garden: "Lối nhỏ",
    },
    lulu: {
      arrived: `${him} tới rồi nè`,
      cta: "Đi rước đèn thôi",
    },
    progress: (n: number, total: number) => `Đã ghé ${n}/${total}`,
  },

  mooncake: {
    heading: "Hộp bánh của tiệm",
    sub: "Chọn một cái đi, tiệm mời.",
    flavors: [
      { id: "thapcam", name: "Thập cẩm", line: "Nhiều nhân quá, cắn miếng nào cũng có hạt dưa. Ngon, nhưng chưa phải cái đặc biệt nhất." },
      { id: "daxanh", name: "Đậu xanh", line: "Ngọt nhẹ, mềm. Kiểu bánh an toàn. Thử cái khác xem?" },
      { id: "trungmuoi", name: "Trứng muối", line: "Có hai lòng đỏ luôn! May mắn ghê. Nhưng còn một cái nữa…" },
      { id: "lulu", name: `Vị ${him} ❤️`, line: "", special: true },
    ],
    specialReveal: {
      before: "Nhân của bánh này là:",
      after: `tình yêu của ${him} dành cho ${her}`,
      note: "Không có hạn sử dụng. Ăn bao nhiêu cũng không hết.",
    },
  },

  rabbit: {
    greeting: `Thỏ Ngọc có 3 câu đố cho ${her}. Dễ lắm, đừng lo.`,
    start: "Chơi luôn",
    done: "Xong rồi!",
  },

  lion: {
    tapHint: "Chạm để lân múa",
    line: "Trung Thu mà thiếu múa lân thì sao được!",
    again: "Múa lần nữa",
  },

  garden: {
    heading: "Một góc vườn nhỏ",
    sub: "Có một bông đang sáng hơn mấy bông khác.",
    line: "Có những thứ dù ở xa nhau vẫn có thể cùng nhìn thấy một bầu trời.",
    after: `${him} để dành chỗ này cho ${her}.`,
  },

  walk: {
    /** Lúc LuLu chạy xe tới đón */
    arrive: `${him} chạy xe tới đón ${her} nè.`,
    /** Lúc LuLu xuống xe, nắm tay */
    intro: `Đi thôi. ${him} cầm tay em.`,
    tapHint: "My chạm vào đèn đang cầm để thả đèn cho dui",
    captions: [
      { at: 0.03, text: "Phố đèn đông vui ghê." },
      { at: 0.24, text: "Đi chậm thôi, mình không vội." },
      { at: 0.48, text: "Sông hôm nay có trăng soi." },
      { at: 0.7, text: "Thả một chiếc đèn, ước một điều." },
      { at: 0.88, text: "Sắp tới rồi." },
    ],
  },

  bridge: {
    lines: ["Đi hết một vòng rồi...", `Nhưng ${him} vẫn còn một món quà cho ${her}.`],
    cta: "Mở quà",
  },

  gift: {
    tapHint: "Chạm vào hộp quà",
    counter: (n: number, total: number) => `Món quà ${n}/${total}`,
    next: "Món tiếp theo",
    openLetter: "Còn một lá thư nữa",
  },

  /** Lá thư cuối cùng. Mỗi phần tử là một đoạn, chuỗi rỗng "" là một dòng trống. */
  letter: {
    greeting: `${her} à,`,
    paragraphs: [
      `Năm nay em không đi rước đèn được thì ${him} mang Trung Thu tới cho em.`,
      "Em cứ ngồi yên nghỉ ngơi cho chân mau khỏi nhé.",
      `Còn rước đèn thì để ${him} dắt em đi trước ở đây.`,
      "Khi chân em khỏe rồi, mình đi thật.",
      `Không cần phải có gì đặc biệt cả.\nChỉ cần em đi cùng ${him} là được.`,
    ],
    signature: him,
    replay: "Đi lại từ đầu",
    memories: "Những điều mình hẹn nhau",
  },

  easterEggs: {
    moon: {
      title: `Một góc nhỏ của ${him} dành cho ${her}`,
      sub: "Mình chưa gặp nhau nên chưa có ảnh chung. Vậy thì để dành chỗ này cho những lần sắp tới.",
      promiseStamp: "Đã hứa",
      tapHint: "Chạm vào từng điều để đóng dấu",
      photoSlot: "Tấm ảnh đầu tiên của hai đứa",
      photoSlotNote: "Để dành. Sắp có rồi.",
    },
    star: {
      title: "Ngôi sao này có chủ rồi",
      body: `${him} đặt tên nó là “${her}”. Tối nào nhìn lên trời cũng thấy.`,
    },
    firefly: {
      counter: (n: number, total: number) => `Đom đóm ${n}/${total}`,
      title: `${her} đã bắt được một con đom đóm ✨`,
      body: `Nó nhắn: “${him} nói em giỏi chịu đau lắm. Ráng thêm chút nữa là khỏi rồi.”`,
    },
    close: "Đóng",
  },

  copyright: "Bản quyền thuộc về ChaserLuLu. Vui lòng không sao chép dưới mọi hình thức.",

  sound: {
    on: "Tắt nhạc",
    off: "Bật nhạc",
  },
};
