import Link from "next/link";
import { Heart, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  service: [
    { name: "出店先を探す", href: "/search?type=space" },
    { name: "出店者を探す", href: "/search?type=vendor" },
    { name: "ご利用ガイド", href: "/guide" },
    { name: "料金プラン", href: "/pricing" },
  ],
  support: [
    { name: "よくある質問", href: "/faq" },
    { name: "お問い合わせ", href: "/contact" },
    { name: "運営会社", href: "/company" },
  ],
  legal: [
    { name: "利用規約", href: "/terms" },
    { name: "プライバシーポリシー", href: "/privacy" },
    { name: "特定商取引法に基づく表記", href: "/legal" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-semibold text-warm-brown">goen</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              出店者と場所をつなぐ、<br />
              あたたかいご縁のマッチングサービス。<br />
              あなたの「やりたい」を、<br />
              素敵な場所で叶えましょう。
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">サービス</h3>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">サポート</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">規約・ポリシー</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-12 rounded-2xl bg-dusty-pink-light/50 p-6 text-center">
          <p className="text-sm text-warm-brown">
            goenは、安心・安全なマッチングを心がけています。<br />
            本人確認済みユーザーのみが利用でき、トラブル時のサポート体制も整っています。
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} goen. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with love for creators and space owners
          </p>
        </div>
      </div>
    </footer>
  );
}
