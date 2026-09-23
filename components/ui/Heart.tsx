/** Trái tim vẽ tay nhỏ, dùng thay emoji trong các dòng chữ quan trọng. */
export function Heart({ className, color = "#ff5a6e" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 20.5C6.2 16.7 2.8 13.4 2.8 9.3 2.8 6.6 4.9 4.6 7.4 4.6c1.9 0 3.4 1 4.6 2.8 1.2-1.8 2.7-2.8 4.6-2.8 2.5 0 4.6 2 4.6 4.7 0 4.1-3.4 7.4-9.2 11.2z"
        fill={color}
      />
      <path d="M6.4 8.2c.4-1.2 1.4-1.9 2.4-1.9" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
