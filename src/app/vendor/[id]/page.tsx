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
  Instagram,
  Twitter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { vendors } from "@/lib/dummy-data";

const reviews = [
  {
    id: "r1",
    author: "鈴木 美咲",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating: 5,
    date: "2024年1月15日",
    content:
      "とても素敵なお店でした！コーヒーがとても美味しく、イベントでも大人気でした。またぜひお願いしたいです。",
  },
  {
    id: "r2",
    author: "田中 健太",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5,
    date: "2024年1月10日",
    content:
      "コミュニケーションがスムーズで、当日の対応も素晴らしかったです。お客様からの評判も良かったです。",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
];

export default function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const vendor = vendors.find((v) => v.id === id) || vendors[0];

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
              <Link href="/search?type=vendor" className="hover:text-primary">
                出店者一覧
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{vendor.name}</span>
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
                  alt={vendor.name}
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
                    alt={`${vendor.name} ${index + 2}`}
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
                    {vendor.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">{vendor.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-soft-coral text-soft-coral" />
                      <span className="font-medium text-foreground">
                        {vendor.rating}
                      </span>
                      <span>({vendor.reviewCount}件のレビュー)</span>
                    </div>
                  </div>
                </div>

                {/* Actions (Mobile) */}
                <div className="flex gap-3 lg:hidden">
                  <Button className="flex-1 rounded-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    メッセージを送る
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
                  <h2 className="text-lg font-semibold mb-4">紹介</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {vendor.description}
                    <br />
                    <br />
                    イベントやマルシェでの出店経験が豊富で、お客様とのコミュニケーションを大切にしています。
                    季節限定のメニューも用意しており、リピーターのお客様にも喜んでいただいています。
                    <br />
                    <br />
                    出店のご相談はお気軽にどうぞ。スケジュールや条件について柔軟に対応いたします。
                  </p>
                </div>

                <Separator />

                {/* Features */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">特徴・こだわり</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-sage-light flex items-center justify-center">
                        <Shield className="h-5 w-5 text-sage" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">本人確認済み</p>
                        <p className="text-xs text-muted-foreground">
                          身分証明書を確認済み
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-dusty-pink-light flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-dusty-pink" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">即日対応可</p>
                        <p className="text-xs text-muted-foreground">
                          急なご依頼も相談可
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
                        ({vendor.reviewCount})
                      </span>
                    </h2>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-soft-coral text-soft-coral" />
                      <span className="font-semibold">{vendor.rating}</span>
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
                  {/* Contact Card */}
                  <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={vendor.image} />
                          <AvatarFallback className="bg-dusty-pink-light text-dusty-pink text-xl">
                            {vendor.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{vendor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            通常1日以内に返信
                          </p>
                        </div>
                      </div>

                      <Button className="w-full rounded-full mb-3">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        メッセージを送る
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
                    </CardContent>
                  </Card>

                  {/* Social Links */}
                  <Card className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">SNS・リンク</h3>
                      <div className="space-y-3">
                        <Link
                          href="#"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                          <span>@cafemaru_official</span>
                          <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                          <span>@cafemaru</span>
                          <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                        </Link>
                      </div>
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
