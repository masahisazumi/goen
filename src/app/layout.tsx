import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "goen - 出店者とスペースをつなぐマッチングサービス",
  description:
    "goenは、キッチンカーやハンドメイド作家と、空きスペースを持つオーナーをつなぐマッチングサービスです。",
  keywords: ["マッチング", "出店", "キッチンカー", "ハンドメイド", "マルシェ", "スペース"],
  openGraph: {
    title: "goen - 出店者とスペースをつなぐマッチングサービス",
    description:
      "キッチンカーやハンドメイド作家と、空きスペースを持つオーナーをつなぐマッチングサービス",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
