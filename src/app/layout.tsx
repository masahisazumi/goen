import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "てんむすび - 出店マッチングサービス",
  description:
    "てんむすびは、キッチンカーやハンドメイド作家と、空きスペースを持つオーナーをつなぐ出店マッチングサービスです。",
  keywords: ["マッチング", "出店", "キッチンカー", "ハンドメイド", "マルシェ", "スペース"],
  openGraph: {
    title: "てんむすび - 出店マッチングサービス",
    description:
      "キッチンカーやハンドメイド作家と、空きスペースを持つオーナーをつなぐ出店マッチングサービス",
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
        className={`${zenMaruGothic.className} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
