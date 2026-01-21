import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Truck,
  MapPin,
  MessageCircle,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "500", suffix: "+", label: "登録スペース" },
  { value: "1,000", suffix: "+", label: "登録出店者" },
  { value: "98", suffix: "%", label: "利用満足度" },
];

const vendorFeatures = [
  {
    icon: MapPin,
    title: "理想の出店場所が見つかる",
    description: "全国のスペースから条件に合った場所を簡単検索",
  },
  {
    icon: MessageCircle,
    title: "スムーズなやり取り",
    description: "オーナーと直接メッセージでスピーディに交渉",
  },
  {
    icon: Shield,
    title: "安心の本人確認済み",
    description: "審査済みスペースのみ掲載で安心して利用可能",
  },
];

const ownerFeatures = [
  {
    icon: Truck,
    title: "魅力的な出店者が集まる",
    description: "キッチンカーやハンドメイド作家が多数登録",
  },
  {
    icon: Star,
    title: "スペースの有効活用",
    description: "空き時間や遊休スペースを収益化",
  },
  {
    icon: CheckCircle,
    title: "簡単なスペース管理",
    description: "予約管理や出店者とのやり取りを一元化",
  },
];

const steps = [
  { step: "01", title: "無料会員登録", desc: "メールアドレスで簡単登録" },
  { step: "02", title: "プロフィール作成", desc: "あなたの魅力をアピール" },
  { step: "03", title: "マッチング", desc: "条件に合う相手を探す" },
  { step: "04", title: "出店開始", desc: "メッセージで詳細を調整" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Full Screen with Large Image */}
        <section className="relative min-h-screen flex items-center">
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                出店場所が見つかる
                <br />
                <span className="text-primary">空きスペース</span>を予約
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                キッチンカーやハンドメイド作家と、空きスペースを持つオーナーをつなぐマッチングサービス
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 h-14 text-base shadow-lg"
                  asChild
                >
                  <Link href="/search?type=space">
                    出店先を探す
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 h-14 text-base"
                  asChild
                >
                  <Link href="/search?type=vendor">
                    出店者を探す
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-16 flex gap-12">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-4xl md:text-5xl font-bold">
                      {stat.value}
                      <span className="text-2xl">{stat.suffix}</span>
                    </p>
                    <p className="mt-1 text-sm text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 z-10">
            <span className="text-xs tracking-widest">SCROLL</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </section>

        {/* For Vendors Section - White Background */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80"
                  alt="キッチンカーで営業する様子"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white font-bold text-lg">出店者様向け</p>
                  <p className="text-white/80 text-sm">理想の出店場所を見つけよう</p>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                  <Truck className="h-4 w-4" />
                  FOR VENDORS
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  出店者の方へ
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  イベント会場、商業施設、オフィス街など、あなたのビジネスに最適な出店場所を見つけましょう。
                </p>

                <div className="mt-8 space-y-6">
                  {vendorFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{feature.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary hover:bg-primary/90 px-8"
                    asChild
                  >
                    <Link href="/search?type=space">
                      出店先を探す
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Owners Section - Dark Background */}
        <section className="py-20 md:py-32 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white mb-6">
                  <MapPin className="h-4 w-4" />
                  FOR SPACE OWNERS
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  スペースオーナーの方へ
                </h2>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  駐車場、空き地、店舗前スペースなど、遊休スペースを有効活用して新たな収益源に。
                </p>

                <div className="mt-8 space-y-6">
                  {ownerFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-gray-900">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{feature.title}</h3>
                          <p className="mt-1 text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-gray-900 hover:bg-gray-100 px-8"
                    asChild
                  >
                    <Link href="/search?type=vendor">
                      出店者を探す
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="スペースでのイベント"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white font-bold text-lg">スペースオーナー様向け</p>
                  <p className="text-white/80 text-sm">空きスペースを収益化しよう</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works - Light Gray Background */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                ご利用の流れ
              </h2>
              <p className="mt-4 text-gray-600">
                簡単4ステップで出店・スペース提供を始められます
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {steps.map((item, index) => (
                <div key={item.step} className="relative text-center">
                  <div className="text-7xl font-bold text-gray-200 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-12 -right-4 h-6 w-6 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid - White Background */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                てんむすびが選ばれる理由
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
                  title: "登録・利用料無料",
                  description: "会員登録から検索まで完全無料。成約時のみ手数料が発生します。",
                },
                {
                  image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80",
                  title: "安心の本人確認",
                  description: "出店者・オーナー共に本人確認を実施。安心してご利用いただけます。",
                },
                {
                  image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
                  title: "全国対応",
                  description: "日本全国のスペースを掲載。地域を選ばず活用できます。",
                },
              ].map((item) => (
                <div key={item.title} className="group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Primary Color Background */}
        <section className="py-20 md:py-32 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              さあ、始めよう
            </h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto">
              登録は無料。今すぐアカウントを作成して、
              あなたのビジネスを次のステージへ。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-gray-100 px-10 h-14 text-base shadow-lg"
                asChild
              >
                <Link href="/register">
                  無料で会員登録
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white text-white hover:bg-white/10 px-10 h-14 text-base"
                asChild
              >
                <Link href="/contact">
                  お問い合わせ
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
