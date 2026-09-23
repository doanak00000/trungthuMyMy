"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { messages } from "@/data/messages";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** "night" cho các góc phố, "hush" cho những góc yên tĩnh hơn */
  tone?: "night" | "hush";
};

/**
 * Tấm giấy trượt lên từ dưới — hợp với ngón cái trên điện thoại.
 * Vuốt xuống, chạm ra ngoài hoặc bấm Esc để đóng.
 */
export function Sheet({ open, onClose, title, children, tone = "night" }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const drag = useDragControls();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 350);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  // Portal ra <body> để tấm giấy luôn nằm trên đèn cầm tay, đom đóm và mặt trăng.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-shadow/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative flex max-h-[88svh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[28px] pb-[env(safe-area-inset-bottom)]"
            style={{
              background:
                tone === "hush"
                  ? "linear-gradient(180deg, #0c1033 0%, #070a22 100%)"
                  : "linear-gradient(180deg, #1b2160 0%, #10144000 140%), #0d1136",
              boxShadow: "0 -18px 60px -10px rgba(255,170,70,0.18), inset 0 1px 0 rgba(255,210,140,0.28)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            {/* chỉ vuốt ở phần đầu tấm giấy mới kéo xuống đóng, để trò chơi bên trong chạm thoải mái */}
            <div className="touch-none" onPointerDown={(e) => drag.start(e)}>
            <div className="flex items-center justify-between px-5 pt-3">
              <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-cloud/25" />
            </div>
            <div className="flex items-start justify-between gap-3 px-6 pt-2">
              {title ? <h2 className="pt-2 text-lg font-bold text-cloud text-balance">{title}</h2> : <span />}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={messages.easterEggs.close}
                className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-cloud/70 hover:text-cloud"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            </div>
            <div className="thin-scrollbar overflow-y-auto overscroll-contain px-6 pb-8 pt-2">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
