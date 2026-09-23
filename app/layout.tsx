import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Playwrite_VN } from "next/font/google";
import { messages } from "@/data/messages";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-vn",
  display: "swap",
});

const hand = Playwrite_VN({
  weight: ["200", "300", "400"],
  variable: "--font-hand-vn",
  display: "swap",
});

export const metadata: Metadata = {
  title: messages.meta.title,
  description: messages.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: messages.meta.title, description: messages.meta.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0d2c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
