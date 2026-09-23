# Trung Thu này, LuLu đưa MyMy đi chơi 🌕

Một đêm Trung Thu nhỏ, làm riêng cho MyMy. Next.js 15 · TypeScript · Tailwind CSS 4 · Framer Motion. Hình vẽ bằng SVG, sao trời bằng Canvas, nhạc tự tổng hợp bằng Web Audio (không cần file nhạc).

Luồng: trăng lên → vé rước đèn → chọn đèn → dạo phố đèn (tiệm bánh, Thỏ Ngọc, múa lân, lối nhỏ bí mật) → đi rước đèn cùng LuLu → dừng trên cầu → hộp quà (tulip, hướng dương, lá thư).

Quà ẩn: chạm **mặt trăng** (những điều hẹn nhau), chạm **ngôi sao hơi hồng** ở góc trái, bắt đủ **7 con đom đóm**.

---

## 1. Chạy trên máy

Cần Node.js 18.18 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Nên bật chế độ điện thoại trong DevTools (F12 → biểu tượng điện thoại) vì web làm cho điện thoại trước.

Khi chạy dev, có thể nhảy thẳng tới một màn để sửa cho nhanh:

```
http://localhost:3000/?scene=festival&visited=3&lantern=lulu
```

`scene`: `intro` · `ticket` · `lantern` · `festival` · `walk` · `bridge` · `gift`
`lantern`: `star` · `rabbit` · `moon` · `flower` · `lulu`
`visited`: số chỗ coi như đã ghé (0–4)

Khi build production, mấy tham số này tự tắt.

## 2. Đổi ảnh quà (hoa)

Ảnh nằm trong `public/gifts/`. Cấu hình ở `data/festival.ts` → `gifts`:

```ts
{ src: "/gifts/tulip.webp", name: "Một bó tulip", note: "Màu hồng, dịu dàng như em.", alt: "…" },
```

- Muốn đổi ảnh: bỏ file mới vào `public/gifts/` rồi sửa `src`.
- Ảnh được cắt khung dọc 4:5, nên dùng ảnh rộng khoảng 900px, định dạng `.webp` hoặc `.jpg` để tải nhanh trên 4G.
- Muốn thêm hay bớt món quà thì thêm hay bớt phần tử trong mảng. Lá thư luôn là món cuối.

Đổi ảnh sang webp nhanh (nếu có ffmpeg): `ffmpeg -i anh.jpg -vf scale=900:-2 public/gifts/anh.webp`

## 3. Sửa lời nhắn

Toàn bộ chữ trong web nằm ở **`data/messages.ts`**: lời mở đầu, vé, câu ở từng góc phố, câu thì thầm lúc đi bộ, lời trên cầu, **lá thư** (`letter`), và các quà ẩn (`easterEggs`).

- Tên hai đứa sửa một chỗ duy nhất: `data/festival.ts` → `couple`.
- Lá thư: `letter.paragraphs`, mỗi phần tử là một đoạn. Muốn xuống dòng trong cùng đoạn thì dùng `\n`.
- Những điều hẹn nhau (khi chạm mặt trăng): `data/festival.ts` → `promises`.
- Chỉ sửa phần chữ trong dấu ngoặc kép, giữ nguyên dấu phẩy và ngoặc là được.

## 4. Sửa câu đố của Thỏ Ngọc

File **`data/quiz.ts`**:

```ts
{
  question: "LuLu thích gì nhất?",
  options: ["Code", "Game", "MyMy ❤️"],
  answer: 2,            // 0 = A, 1 = B, 2 = C
  hint: "Hmm… thử lại đi, dễ mà.",
  cheer: "Chuẩn luôn!",
},
```

Thêm bớt câu thoải mái. Chọn sai không bị gì, chỉ hiện gợi ý rồi chọn lại.

## 5. Các chỉnh khác

`data/festival.ts`:
- `festivalConfig.minVisitsToWalk`: ghé bao nhiêu chỗ thì LuLu xuất hiện (mặc định 3).
- `festivalConfig.firefliesToCatch`: số đom đóm cần bắt (mặc định 7).
- `festivalConfig.walkDurationSeconds`: đi rước đèn bao lâu (mặc định 48 giây).
- `audioConfig.musicSrc`: muốn dùng bài nhạc riêng thì bỏ file mp3 vào `public/audio/` rồi ghi đường dẫn, ví dụ `"/audio/ruoc-den.mp3"`. Để `null` thì web tự chơi nhạc ngũ cung nhẹ.

Nhạc chỉ bắt đầu sau lần chạm đầu tiên và có nút bật/tắt ở góc phải trên.

## 6. Đưa lên Vercel

**Cách 1: qua GitHub (khuyên dùng)**
1. Đẩy thư mục này lên một repo GitHub (để private cũng được).
2. Vào https://vercel.com/new → Import repo đó.
3. Vercel tự nhận Next.js, không cần chỉnh gì. Bấm **Deploy**.
4. Xong sẽ có link dạng `https://ten-du-an.vercel.app`, gửi cho MyMy.

**Cách 2: bằng dòng lệnh**
```bash
npm i -g vercel
vercel          # lần đầu: đăng nhập, trả lời vài câu, tạo bản preview
vercel --prod   # đưa lên bản chính
```

Web đã đặt `noindex` nên Google sẽ không liệt kê trang này.

## Cấu trúc

```
app/                 layout, trang chính, globals.css (màu, font, animation)
components/
  intro/             màn trăng lên
  ticket/            vé rước đèn
  lantern/           vẽ đèn, chọn đèn, đèn cầm tay, đèn bay
  festival/          phố đèn cuộn ngang
  mooncake/          xe bánh, hộp bánh
  rabbit/            Thỏ Ngọc + câu đố
  lion-dance/        múa lân
  garden/            vườn hoa bí mật
  lantern-walk/      đi rước đèn (parallax)
  gift/              cây cầu, hộp quà, bó hoa
  letter/            lá thư giấy ô ly
  easter-eggs/       mặt trăng, ngôi sao, đom đóm
  sky/               bầu trời, trăng, sao
  story/             trạng thái câu chuyện
  ui/                nút, tấm trượt, bật tắt nhạc
data/                festival.ts · messages.ts · quiz.ts  ← sửa nội dung ở đây
lib/audio.ts         âm thanh
public/gifts/        ảnh quà
```
