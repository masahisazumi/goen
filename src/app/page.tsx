import Link from "next/link";
import Image from "next/image";
import {
  UserPlus,
  MessageCircle,
  Star,
  ShieldCheck,
  ArrowRight,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBox } from "@/components/common/SearchBox";
import { ProfileCard } from "@/components/common/ProfileCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { vendors, spaces, testimonials, features, stats } from "@/lib/dummy-data";

const iconMap: Record<string, React.ElementType> = {
  "user-plus": UserPlus,
  "message-circle": MessageCircle,
  star: Star,
  "shield-check": ShieldCheck,
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-dusty-pink-light/30 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  あなたの「やりたい」を
                  <br />
                  <span className="text-primary">素敵な場所</span>で叶えよう
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  goenは、キッチンカーやハンドメイド作家と、
                  <br className="hidden sm:block" />
                  空きスペースを持つオーナーをつなぐ
                  <br className="hidden sm:block" />
                  マッチングサービスです。
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Button size="lg" className="rounded-full text-base" asChild>
                    <Link href="/search?type=space">
                      出店先を探す
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-base"
                    asChild
                  >
                    <Link href="/search?type=vendor">出店者を探す</Link>
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-sage-light/50">
                  <Image
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                    alt="マルシェの様子"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-light">
                      <Heart className="h-5 w-5 text-sage" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">累計マッチング</p>
                      <p className="text-lg font-bold text-primary">15,000+件</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 rounded-2xl bg-card p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-soft-coral text-soft-coral" />
                    <span className="font-bold">満足度98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">さっそく探してみよう</h2>
              <p className="mt-2 text-muted-foreground">
                エリアやカテゴリーから、理想のパートナーを見つけましょう
              </p>
            </div>
            <SearchBox />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary md:text-4xl">
                    {stat.value}
                    <span className="text-lg">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold md:text-3xl">
                goenが選ばれる理由
              </h2>
              <p className="mt-3 text-muted-foreground">
                安心して使えるマッチングプラットフォーム
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = iconMap[feature.icon];
                return (
                  <Card
                    key={feature.title}
                    className="border-0 bg-card shadow-sm rounded-2xl"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dusty-pink-light">
                        <Icon className="h-7 w-7 text-dusty-pink" />
                      </div>
                      <h3 className="mt-4 font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Vendors Section */}
        <section className="py-16 md:py-24 bg-sage-light/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  注目の出店者
                </h2>
                <p className="mt-2 text-muted-foreground">
                  人気のキッチンカーやハンドメイド作家をご紹介
                </p>
              </div>
              <Button variant="ghost" className="hidden sm:flex rounded-full" asChild>
                <Link href="/search?type=vendor">
                  すべて見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.slice(0, 3).map((vendor) => (
                <ProfileCard
                  key={vendor.id}
                  id={vendor.id}
                  type="vendor"
                  name={vendor.name}
                  image={vendor.image}
                  location={vendor.location}
                  rating={vendor.rating}
                  reviewCount={vendor.reviewCount}
                  tags={vendor.tags}
                  description={vendor.description}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/search?type=vendor">
                  すべての出店者を見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Spaces Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  人気の出店スペース
                </h2>
                <p className="mt-2 text-muted-foreground">
                  イベントやマルシェに最適なスペースをご紹介
                </p>
              </div>
              <Button variant="ghost" className="hidden sm:flex rounded-full" asChild>
                <Link href="/search?type=space">
                  すべて見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.slice(0, 3).map((space) => (
                <ProfileCard
                  key={space.id}
                  id={space.id}
                  type="space"
                  name={space.name}
                  image={space.image}
                  location={space.location}
                  rating={space.rating}
                  reviewCount={space.reviewCount}
                  tags={space.tags}
                  description={space.description}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/search?type=space">
                  すべてのスペースを見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-dusty-pink-light/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold md:text-3xl">
                ご利用者の声
              </h2>
              <p className="mt-3 text-muted-foreground">
                goenで素敵な出会いを見つけた方々からのメッセージ
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border-0 bg-card shadow-sm rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-soft-coral text-soft-coral"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.image} />
                        <AvatarFallback className="bg-dusty-pink-light text-dusty-pink">
                          {testimonial.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              あなたも素敵なご縁を見つけませんか？
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              goenは無料で登録できます。
              <br />
              出店者の方も、スペースオーナーの方も、
              <br />
              まずはプロフィールを作成してみましょう。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="rounded-full text-base" asChild>
                <Link href="/register">
                  無料で会員登録
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-base"
                asChild
              >
                <Link href="/guide">サービス詳細を見る</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
