"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Share2,
  MessageCircle,
  Instagram,
  Twitter,
  ExternalLink,
  Shield,
  Calendar,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Vendor {
  id: string;
  userId: string;
  displayName: string;
  description: string | null;
  category: string | null;
  area: string | null;
  tags: string | null;
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  isVerified: boolean;
  images: { id: string; url: string }[];
  reviews: {
    id: string;
    rating: number;
    content: string | null;
    createdAt: string;
    author: { id: string; name: string | null; image: string | null };
  }[];
  _count: { reviews: number };
  user: { id: string; name: string | null; image: string | null };
}

export default function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(`/api/vendors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVendor(data);
        }
      } catch (error) {
        console.error("Error fetching vendor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vendor?.displayName,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("URLをコピーしました");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">出店者が見つかりませんでした</p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/search?type=vendor">出店者一覧に戻る</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tags = vendor.tags ? JSON.parse(vendor.tags) : [];
  const galleryImages = vendor.images.length > 0
    ? vendor.images.map(img => img.url)
    : ["https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80"];
  const averageRating = vendor.reviews.length > 0
    ? (vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length).toFixed(1)
    : "0.0";

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
              <span className="text-foreground">{vendor.displayName}</span>
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
                  alt={vendor.displayName}
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
                    alt={`${vendor.displayName} ${index + 2}`}
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
                    {tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {vendor.category && (
                      <Badge variant="outline" className="rounded-full">
                        {vendor.category}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">{vendor.displayName}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {vendor.area && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.area}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-soft-coral text-soft-coral" />
                      <span className="font-medium text-foreground">
                        {averageRating}
                      </span>
                      <span>({vendor._count.reviews}件のレビュー)</span>
                    </div>
                  </div>
                </div>

                {/* Actions (Mobile) */}
                <div className="flex gap-3 lg:hidden">
                  <Button className="flex-1 rounded-full" asChild>
                    <Link href="/messages">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      メッセージを送る
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">紹介</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {vendor.description || "詳細な紹介文はまだ登録されていません。"}
                  </p>
                </div>

                <Separator />

                {/* Features */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">特徴・こだわり</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {vendor.isVerified && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-sage-light/50">
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
                    )}
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
                        ({vendor._count.reviews})
                      </span>
                    </h2>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-soft-coral text-soft-coral" />
                      <span className="font-semibold">{averageRating}</span>
                    </div>
                  </div>
                  {vendor.reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      まだレビューはありません
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {vendor.reviews.map((review) => (
                        <Card key={review.id} className="border-0 shadow-sm rounded-2xl">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={review.author.image || ""} />
                                <AvatarFallback className="bg-dusty-pink-light text-dusty-pink">
                                  {review.author.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{review.author.name || "ユーザー"}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString("ja-JP")}
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
                                {review.content && (
                                  <p className="mt-3 text-sm text-muted-foreground">
                                    {review.content}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  {vendor._count.reviews > 3 && (
                    <Button variant="outline" className="w-full mt-6 rounded-full">
                      すべてのレビューを見る
                    </Button>
                  )}
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
                          <AvatarImage src={vendor.user?.image || ""} />
                          <AvatarFallback className="bg-dusty-pink-light text-dusty-pink text-xl">
                            {vendor.displayName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{vendor.displayName}</h3>
                          <p className="text-sm text-muted-foreground">
                            通常1日以内に返信
                          </p>
                        </div>
                      </div>

                      <Button className="w-full rounded-full mb-3" asChild>
                        <Link href="/messages">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          メッセージを送る
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={handleShare}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        シェアする
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Social Links */}
                  {(vendor.instagram || vendor.twitter || vendor.website) && (
                    <Card className="border-0 shadow-sm rounded-2xl">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">SNS・リンク</h3>
                        <div className="space-y-3">
                          {vendor.instagram && (
                            <Link
                              href={`https://instagram.com/${vendor.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Instagram className="h-5 w-5" />
                              <span>{vendor.instagram}</span>
                              <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                            </Link>
                          )}
                          {vendor.twitter && (
                            <Link
                              href={`https://twitter.com/${vendor.twitter.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Twitter className="h-5 w-5" />
                              <span>{vendor.twitter}</span>
                              <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                            </Link>
                          )}
                          {vendor.website && (
                            <Link
                              href={vendor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-5 w-5" />
                              <span className="truncate">ウェブサイト</span>
                              <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
