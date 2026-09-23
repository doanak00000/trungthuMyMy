/**
 * Câu đố của Thỏ Ngọc. Sửa thoải mái — thêm/bớt câu cũng được.
 * `answer` là vị trí đáp án đúng (0 = A, 1 = B, 2 = C…).
 * `hint` hiện ra khi chọn sai (không bị trừ điểm gì hết, chọn lại là được).
 */

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  hint: string;
  /** Câu Thỏ nói khi trả lời đúng */
  cheer: string;
};

export const quiz: QuizQuestion[] = [
  {
    question: "LuLu thích gì nhất?",
    options: ["Code", "Game", "MyMy ❤️"],
    answer: 2,
    hint: "Hmm… thử lại đi, dễ mà.",
    cheer: "Chuẩn luôn!",
  },
  {
    question: "Trung Thu năm nay MyMy đi rước đèn với ai?",
    options: ["Với Thỏ", "Với LuLu", "Đi một mình"],
    answer: 1,
    hint: "Người đang dắt em đi đó…",
    cheer: "Đúng rồi, LuLu đang đi cạnh nè.",
  },
  {
    question: "Chân MyMy khỏi rồi thì hai đứa sẽ…",
    options: ["Đi rước đèn thật", "Đi ăn thật nhiều", "Cả hai luôn"],
    answer: 2,
    hint: "Tham một chút cũng được mà.",
    cheer: "Hứa rồi nha!",
  },
];

export const quizReward = {
  title: "MyMy nhận được một chiếc đèn sao!",
  body: "Thỏ bảo: cầm thêm cái này cho đường sáng hơn.",
};
