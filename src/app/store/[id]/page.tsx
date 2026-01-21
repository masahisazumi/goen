"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Share2,
  MessageCircle,
  ExternalLink,
  Loader2,
  Store,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { Instagram, Twitter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface StoreData {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  area: string | null;
  tags: string | null;
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  isActive: boolean;
  images: { id: string; url: string }[];
  owner: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [store, setStore] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`/api/stores/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStore(data);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store?.name,
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

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">店舗が見つかりませんでした</p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/search?type=vendor">出店者一覧に戻る</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tags = store.tags ? JSON.parse(store.tags) : [];
  const galleryImages = store.images.length > 0
    ? store.images.map(img => img.url)
    : [];

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
              <span className="text-foreground">{store.name}</span>
            </nav>
          </div>
        </div>

        {/* Gallery or Placeholder */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 md:gap-4 rounded-2xl overflow-hidden">
                <div className="col-span-4 md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-square">
                  <Image
                    src={galleryImages[0]}
                    alt={store.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {galleryImages.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="hidden md:block relative aspect-square"
                  >
                    <Image
                      src={image}
                      alt={`${store.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl aspect-[2/1] flex items-center justify-center">
                <Store className="h-16 w-16 text-gray-300" />
              </div>
            )}
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
                    {store.category && (
                      <Badge variant="default" className="rounded-full">
                        {store.category}
                      </Badge>
                    )}
                    {tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
                  {store.area && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>主な出店エリア: {store.area}</span>
                    </div>
                  )}
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
                  <h2 className="text-lg font-semibold mb-4">店舗紹介</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {store.description || "店舗紹介はまだ登録されていません。"}
                  </p>
                </div>

                {/* SNS Links (if any) */}
                {(store.instagram || store.twitter || store.website) && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="text-lg font-semibold mb-4">SNS・ウェブサイト</h2>
                      <div className="flex flex-wrap gap-4">
                        {store.website && (
                          <Link
                            href={store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Globe className="h-5 w-5" />
                            <span>ウェブサイト</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        {store.instagram && (
                          <Link
                            href={`https://instagram.com/${store.instagram.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Instagram className="h-5 w-5" />
                            <span>{store.instagram}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        {store.twitter && (
                          <Link
                            href={`https://twitter.com/${store.twitter.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Twitter className="h-5 w-5" />
                            <span>{store.twitter}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Contact Card */}
                  <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={store.owner?.image || ""} />
                          <AvatarFallback className="bg-dusty-pink-light text-dusty-pink text-xl">
                            {store.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{store.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {store.owner?.name || "オーナー"}
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

                  {/* Back Link */}
                  <Link
                    href="/search?type=vendor"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    出店者一覧に戻る
                  </Link>
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
