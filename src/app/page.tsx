"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Palette,
  Package,
  Search,
  MessageCircle,
  Handshake,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfileCard } from "@/components/common/ProfileCard";
import { Button } from "@/components/ui/button";
import { VENDOR_CATEGORIES } from "@/lib/constants";

const categoryIcons = {
  Truck,
  Palette,
  Package,
} as const;

interface VendorResult {
  id: string;
  storeId?: string;
  displayName: string;
  description: string;
  area: string;
  tags: string;
  images: { url: string }[];
  user: { image: string };
  averageRating: number;
  reviewCount: number;
}

const steps = [
  { icon: Search, title: "カテゴリを選ぶ", desc: "キッチンカー・ハンドメイドなどから選択" },
  { icon: Truck, title: "出店者を探す", desc: "エリアやキーワードで絞り込み" },
  { icon: MessageCircle, title: "メッセージを送る", desc: "気になる出店者に直接連絡" },
  { icon: Handshake, title: "出店決定", desc: "条件を話し合って出店を決定" },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;
  const [newVendors, setNewVendors] = useState<VendorResult[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<VendorResult[]>([]);

  useEffect(() => {
    fetch("/api/vendors?limit=6&sort=newest")
      .then((r) => r.json())
      .then((data) => setNewVendors(data.vendors || []))
      .catch(() => {});
    fetch("/api/vendors?featured=true&limit=6")
      .then((r) => r.json())
      .then((data) => setFeaturedVendors(data.vendors || []))
      .catch(() => {});
  }, []);

  const toCard = (v: VendorResult) => ({
    id: v.storeId || v.id,
    name: v.displayName,
    image: v.images?.[0]?.url || v.user?.image || "/placeholder.jpg",
    location: v.area || "未設定",
    rating: v.averageRating || 0,
    reviewCount: v.reviewCount || 0,
    tags: v.tags ? JSON.parse(v.tags) : [],
    description: v.description || "",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Compact 50vh */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?w=1920&q=80"
              alt="キッチンカーマルシェの賑わい"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                出店者を探す
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                キッチンカー・ハンドメイドショップなど、
                あなたのイベントにぴったりの出店者が見つかる
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-14 text-base shadow-lg"
                  asChild
                >
                  <Link href="/search?type=vendor">
                    出店者を検索する
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline-white"
                  className="rounded-full px-8 h-14 text-base"
                  asChild
                >
                  {isLoggedIn ? (
                    <Link href="/mypage">
                      マイページ
                    </Link>
                  ) : (
                    <Link href="/register?type=vendor">
                      出店者として登録
                    </Link>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Cards - 3 Columns */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                カテゴリから探す
              </h2>
              <p className="mt-4 text-gray-600">
                目的に合った出店者をカテゴリから検索
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {VENDOR_CATEGORIES.map((cat) => {
                const Icon = categoryIcons[cat.icon as keyof typeof categoryIcons];
                return (
                  <Link
                    key={cat.id}
                    href={`/search?type=vendor&category=${cat.label}`}
                    className="group relative rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {cat.description}
                    </p>
                    <ArrowRight className="mx-auto mt-4 h-5 w-5 text-gray-300 transition-colors group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* New Vendors Section */}
        {newVendors.length > 0 && (
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    新着の出店者
                  </h2>
                  <p className="mt-2 text-gray-600">
                    最近登録された出店者をチェック
                  </p>
                </div>
                <Button variant="outline" className="rounded-full hidden sm:flex" asChild>
                  <Link href="/search?type=vendor">
                    すべて見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {newVendors.map((v) => {
                  const card = toCard(v);
                  return (
                    <ProfileCard
                      key={card.id}
                      id={card.id}
                      type="vendor"
                      name={card.name}
                      image={card.image}
                      location={card.location}
                      rating={card.rating}
                      reviewCount={card.reviewCount}
                      tags={card.tags}
                      description={card.description}
                    />
                  );
                })}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/search?type=vendor">
                    すべて見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Featured Vendors Section */}
        {featuredVendors.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    注目の出店者
                  </h2>
                  <p className="mt-2 text-gray-600">
                    写真付きで詳しく紹介されている出店者
                  </p>
                </div>
                <Button variant="outline" className="rounded-full hidden sm:flex" asChild>
                  <Link href="/search?type=vendor&featured=true">
                    すべて見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredVendors.map((v) => {
                  const card = toCard(v);
                  return (
                    <ProfileCard
                      key={card.id}
                      id={card.id}
                      type="vendor"
                      name={card.name}
                      image={card.image}
                      location={card.location}
                      rating={card.rating}
                      reviewCount={card.reviewCount}
                      tags={card.tags}
                      description={card.description}
                    />
                  );
                })}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/search?type=vendor&featured=true">
                    すべて見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                ご利用の流れ
              </h2>
              <p className="mt-4 text-gray-600">
                簡単4ステップで出店者が見つかります
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="relative text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white mx-auto mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="text-sm font-bold text-primary mb-2">
                      STEP {index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden lg:block absolute top-6 -right-4 h-6 w-6 text-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              出店者を登録しませんか？
            </h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto">
              登録は無料。プロフィールを作成して、あなたのビジネスをアピールしましょう。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="white-primary"
                className="rounded-full px-10 h-14 text-base shadow-lg"
                asChild
              >
                <Link href="/register?type=vendor">
                  無料で出店者登録
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline-white"
                className="rounded-full px-10 h-14 text-base"
                asChild
              >
                <Link href="/search?type=space">
                  スペースオーナーの方はこちら
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
