"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Users,
  Zap,
  Droplets,
  Car,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { spaces } from "@/lib/dummy-data";

const reviews = [
  {
    id: "r1",
    author: "高橋 さやか",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    date: "2024年1月20日",
    content:
      "立地が最高で、たくさんのお客様に来ていただけました。オーナーさんも親切で、とても出店しやすい環境でした。",
  },
  {
    id: "r2",
    author: "山本 太郎",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5,
    date: "2024年1月18日",
    content:
      "設備も整っていて、電源も使えるので助かりました。また次回もぜひ利用したいです。",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
];

const facilities = [
  { icon: Zap, label: "電源あり", available: true },
  { icon: Droplets, label: "水道あり", available: true },
  { icon: Car, label: "駐車場あり", available: true },
  { icon: Users, label: "トイレあり", available: true },
];

export default function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const space = spaces.find((s) => s.id === id) || spaces[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-cream py-3">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                ホーム
              </Link>
              <span className="mx-2">/</span>
              <Link href="/search?type=space" className="hover:text-primary">
                スペース一覧
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{space.name}</span>
            </nav>
          </div>
        </div>

        {/* Gallery */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-2 md:gap-4 rounded-2xl overflow-hidden">
              <div className="col-span-4 md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-square">
                <Image
                  src={galleryImages[0]}
                  alt={space.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {galleryImages.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="hidden md:block relative aspect-square"
                >
                  <Image
                    src={image}
                    alt={`${space.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {space.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">{space.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{space.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-soft-coral text-soft-coral" />
                      <span className="font-medium text-foreground">
                        {space.rating}
                      </span>
                      <span>({space.reviewCount}件のレビュー)</span>
                    </div>
                  </div>
                </div>

                {/* Price & Capacity (Mobile) */}
                <Card className="lg:hidden border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">利用料金</p>
                        <p className="text-xl font-bold text-primary">
                          {space.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">収容可能</p>
                        <p className="font-semibold">{space.capacity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions (Mobile) */}
                <div className="flex gap-3 lg:hidden">
                  <Button className="flex-1 rounded-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    出店相談する
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">スペース紹介</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {space.description}
                    <br />
                    <br />
                    駅から徒歩5分の好立地で、週末には多くの人通りがあります。
                    カフェやレストランが立ち並ぶエリアで、感度の高いお客様が多く訪れます。
                    <br />
                    <br />
                    定期的なマルシェやポップアップの実績があり、出店者さんからも好評をいただいています。
                    初めての出店でも安心してご利用いただけるよう、サポートいたします。
                  </p>
                </div>

                <Separator />

                {/* Facilities */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">設備・サービス</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {facilities.map((facility) => (
                      <div
                        key={facility.label}
                        className={`flex items-center gap-3 p-4 rounded-xl ${
                          facility.available
                            ? "bg-sage-light/50"
                            : "bg-muted/50 opacity-50"
                        }`}
                      >
                        <facility.icon
                          className={`h-5 w-5 ${
                            facility.available ? "text-sage" : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {facility.label}
                        </span>
                        {facility.available && (
                          <CheckCircle2 className="h-4 w-4 text-sage ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Availability */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">利用可能日時</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">営業時間</p>
                        <p className="text-xs text-muted-foreground">
                          10:00 〜 20:00
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">定休日</p>
                        <p className="text-xs text-muted-foreground">
                          水曜日（祝日の場合は翌日）
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      レビュー
                      <span className="ml-2 text-muted-foreground font-normal">
                        ({space.reviewCount})
                      </span>
                    </h2>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-soft-coral text-soft-coral" />
                      <span className="font-semibold">{space.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <Card key={review.id} className="border-0 shadow-sm rounded-2xl">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback className="bg-dusty-pink-light text-dusty-pink">
                                {review.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{review.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  {review.date}
                                </p>
                              </div>
                              <div className="flex gap-0.5 mt-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3.5 w-3.5 fill-soft-coral text-soft-coral"
                                  />
                                ))}
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground">
                                {review.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6 rounded-full">
                    すべてのレビューを見る
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Booking Card */}
                  <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground">利用料金</p>
                        <p className="text-2xl font-bold text-primary">
                          {space.price}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          収容可能: {space.capacity}
                        </p>
                      </div>

                      <Button className="w-full rounded-full mb-3">
                        <Calendar className="mr-2 h-4 w-4" />
                        出店相談する
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-full"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          お気に入り
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" />
                          <AvatarFallback className="bg-sage-light text-sage">
                            O
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">オーナー: 佐藤さん</p>
                          <p className="text-xs text-muted-foreground">
                            通常1日以内に返信
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4 rounded-full"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        オーナーに質問する
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Map Placeholder */}
                  <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">地図を表示</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {space.location}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
