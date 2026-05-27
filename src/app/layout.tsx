import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { QueryProvider } from "@/providers/QueryProvider"; // ← 추가

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopApp",
  description: "쇼핑몰 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {" "}
          {/* ← 추가 */}
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </QueryProvider>{" "}
        {/* ← 추가 */}
      </body>
    </html>
  );
}
