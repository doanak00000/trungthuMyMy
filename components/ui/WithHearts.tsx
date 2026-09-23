import { Fragment } from "react";
import { Heart } from "./Heart";

/**
 * Hiện chữ, thay mọi "❤️" trong chuỗi bằng trái tim vẽ tay (để không bị emoji
 * của từng hãng điện thoại). Trong data/ cứ gõ ❤️ bình thường.
 */
export function WithHearts({ text, className = "inline size-[0.95em] -translate-y-[0.08em]" }: { text: string; className?: string }) {
  const parts = text.split("❤️");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <Heart className={className} />}
        </Fragment>
      ))}
    </>
  );
}
