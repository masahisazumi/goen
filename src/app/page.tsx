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
  Eye,
  UserPlus,
  MessageCircle,
  Handshake,
  CheckCircle2,
  Star,
  Shield,
  TrendingUp,
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
  { icon: UserPlus, title: "無料で登録", desc: "メールまたはSNSで簡単アカウント作成" },
  { icon: Truck, title: "プロフィールを作成", desc: "写真・メニュー・こだわりをアピール" },
  { icon: Eye, title: "スペースオーナーが閲覧", desc: "あなたのページをオーナーが見つけます" },
  { icon: Handshake, title: "出店オファーが届く", desc: "メッセージで条件を相談して出店決定" },
];

const benefits = [
  {
    icon: Eye,
    title: "スペースオーナーの目に留まる",
    desc: "登録するだけで、出店場所を提供したいオーナーがあなたを見つけてくれます。自分から営業する必要はありません。",
  },
  {
    icon: Star,
    title: "あなたの魅力を最大限にアピール",
    desc: "写真・メニュー・こだわりポイントなど、充実したプロフィールであなたのお店の魅力を伝えられます。",
  },
  {
    icon: Shield,
    title: "完全無料で利用可能",
    desc: "登録もプロフィール作成もすべて無料。まずは登録して、あなたのお店をアピールしましょう。",
  },
  {
    icon: TrendingUp,
    title: "出店チャンスが広がる",
    desc: "イベント・マルシェ・商業施設など、さまざまなスペースオーナーがあなたの出店先候補です。",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;
  const [featuredVendors, setFeaturedVendors] = useState<VendorResult[]>([]);
  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    fetch("/api/vendors?featured=true&limit=6")
      .then((r) => r.json())
      .then((data) => setFeaturedVendors(data.vendors || []))
      .catch(() => {});
    fetch("/api/vendors?limit=0")
      .then((r) => r.json())
      .then((data) => setVendorCount(data.total || 0))
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

  const ctaHref = isLoggedIn ? "/mypage" : "/register?type=vendor";
  const ctaLabel = isLoggedIn ? "マイページへ" : "無料で出店者登録";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?w=1920&q=80"
              alt="キッチンカーマルシェの賑わい"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-white py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                {vendorCount > 0
                  ? `現在 ${vendorCount} 名の出店者が登録中`
                  : "出店者の登録受付中"}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                登録するだけで
                <br />
                出店オファーが届く
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                てんむすびに登録すれば、スペースオーナーがあなたのお店を見つけてくれます。営業不要、プロフィールを作るだけ。
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-14 text-base shadow-lg"
                  asChild
                >
                  <Link href={ctaHref}>
                    {ctaLabel}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline-white"
                  className="rounded-full px-8 h-14 text-base"
                  asChild
                >
                  <Link href="/search?type=vendor">
                    登録中の出店者を見る
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  登録無料
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  最短1分で登録
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  オーナーから直接連絡
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                てんむすびに登録するメリット
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                出店場所を探す手間を減らし、あなたのビジネスに集中できます
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                出店までの流れ
              </h2>
              <p className="mt-4 text-gray-600">
                簡単4ステップで出店チャンスが広がります
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

            <div className="mt-12 text-center">
              <Button size="lg" className="rounded-full px-10 h-14 text-base" asChild>
                <Link href={ctaHref}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                登録できるカテゴリ
              </h2>
              <p className="mt-4 text-gray-600">
                あなたの業種に合ったカテゴリで登録できます
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {VENDOR_CATEGORIES.map((cat) => {
                const Icon = categoryIcons[cat.icon as keyof typeof categoryIcons];
                return (
                  <div
                    key={cat.id}
                    className="relative rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {cat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Vendors */}
        {featuredVendors.length > 0 && (
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  すでに登録している出店者
                </h2>
                <p className="mt-4 text-gray-600">
                  多くの出店者がてんむすびを活用しています
                </p>
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

              <div className="mt-8 text-center">
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/search?type=vendor">
                    すべての出店者を見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              あなたのお店を待っている
              <br className="sm:hidden" />
              オーナーがいます
            </h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto">
              てんむすびに登録して、出店チャンスを広げましょう。
              <br />
              登録は無料、わずか1分で完了します。
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                variant="white-primary"
                className="rounded-full px-10 h-14 text-base shadow-lg"
                asChild
              >
                <Link href={ctaHref}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
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
