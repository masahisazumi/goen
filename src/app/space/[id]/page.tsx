"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Loader2,
  X,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Space {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  capacity: string | null;
  price: string | null;
  tags: string | null;
  facilities: string | null;
  openingHours: string | null;
  closedDays: string | null;
  images: { id: string; url: string }[];
  reviews: {
    id: string;
    rating: number;
    content: string | null;
    createdAt: string;
    author: { id: string; name: string | null; image: string | null };
  }[];
  _count: { reviews: number; favorites: number };
}

const defaultFacilities = [
  { icon: Zap, label: "電源あり", key: "power" },
  { icon: Droplets, label: "水道あり", key: "water" },
  { icon: Car, label: "駐車場あり", key: "parking" },
  { icon: Users, label: "トイレあり", key: "toilet" },
];

export default function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await fetch(`/api/spaces/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSpace(data);
        }
      } catch (error) {
        console.error("Error fetching space:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpace();
  }, [id]);

  // Check if space is favorited
  useEffect(() => {
    const checkFavorite = async () => {
      if (!session?.user) return;
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const favorites = await res.json();
          setIsFavorite(favorites.some((f: { space: { id: string } }) => f.space.id === id));
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };
    checkFavorite();
  }, [session, id]);

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setIsFavoriteLoading(true);
    try {
      if (isFavorite) {
        await fetch(`/api/favorites?spaceId=${id}`, { method: "DELETE" });
        setIsFavorite(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spaceId: id }),
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!bookingDate) return;

    setIsBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId: id,
          date: bookingDate,
          message: bookingMessage,
        }),
      });

      if (res.ok) {
        setShowBookingDialog(false);
        setBookingSuccess(true);
        setBookingDate("");
        setBookingMessage("");
      } else {
        const data = await res.json();
        alert(data.error || "予約に失敗しました");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("予約に失敗しました");
    } finally {
      setIsBooking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: space?.name,
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

  if (!space) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">スペースが見つかりませんでした</p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/search?type=space">スペース一覧に戻る</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tags = space.tags ? JSON.parse(space.tags) : [];
  const facilities = space.facilities ? JSON.parse(space.facilities) : [];
  const galleryImages = space.images.length > 0
    ? space.images.map(img => img.url)
    : ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"];
  const averageRating = space.reviews.length > 0
    ? (space.reviews.reduce((sum, r) => sum + r.rating, 0) / space.reviews.length).toFixed(1)
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
                  <h1 className="text-2xl md:text-3xl font-bold">{space.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{space.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-soft-coral text-soft-coral" />
                      <span className="font-medium text-foreground">
                        {averageRating}
                      </span>
                      <span>({space._count.reviews}件のレビュー)</span>
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
                  <Button className="flex-1 rounded-full" onClick={() => setShowBookingDialog(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    出店相談する
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={handleToggleFavorite}
                    disabled={isFavoriteLoading}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-soft-coral text-soft-coral" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
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
                    {defaultFacilities.map((facilityDef) => {
                      const isAvailable = facilities.includes(facilityDef.key);
                      return (
                        <div
                          key={facilityDef.key}
                          className={`flex items-center gap-3 p-4 rounded-xl ${
                            isAvailable
                              ? "bg-sage-light/50"
                              : "bg-muted/50 opacity-50"
                          }`}
                        >
                          <facilityDef.icon
                            className={`h-5 w-5 ${
                              isAvailable ? "text-sage" : "text-muted-foreground"
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {facilityDef.label}
                          </span>
                          {isAvailable && (
                            <CheckCircle2 className="h-4 w-4 text-sage ml-auto" />
                          )}
                        </div>
                      );
                    })}
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
                          {space.openingHours || "お問い合わせください"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">定休日</p>
                        <p className="text-xs text-muted-foreground">
                          {space.closedDays || "お問い合わせください"}
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
                        ({space._count.reviews})
                      </span>
                    </h2>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-soft-coral text-soft-coral" />
                      <span className="font-semibold">{averageRating}</span>
                    </div>
                  </div>
                  {space.reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      まだレビューはありません
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {space.reviews.map((review) => (
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
                  {space._count.reviews > 3 && (
                    <Button variant="outline" className="w-full mt-6 rounded-full">
                      すべてのレビューを見る
                    </Button>
                  )}
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
                          {space.price || "要相談"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          収容可能: {space.capacity || "お問い合わせください"}
                        </p>
                      </div>

                      <Button className="w-full rounded-full mb-3" onClick={() => setShowBookingDialog(true)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        出店相談する
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-full"
                          onClick={handleToggleFavorite}
                          disabled={isFavoriteLoading}
                        >
                          <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-soft-coral text-soft-coral" : ""}`} />
                          {isFavorite ? "お気に入り済み" : "お気に入り"}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-sage-light text-sage">
                            O
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">スペースオーナー</p>
                          <p className="text-xs text-muted-foreground">
                            通常1日以内に返信
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4 rounded-full"
                        asChild
                      >
                        <Link href="/messages">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          オーナーに質問する
                        </Link>
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

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>出店相談</DialogTitle>
            <DialogDescription>
              {space.name}への出店相談を申し込みます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="date">希望日</Label>
              <Input
                id="date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">メッセージ（任意）</Label>
              <Textarea
                id="message"
                placeholder="出店内容やご質問などをお書きください"
                value={bookingMessage}
                onChange={(e) => setBookingMessage(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setShowBookingDialog(false)}
            >
              キャンセル
            </Button>
            <Button
              className="flex-1 rounded-full"
              onClick={handleBooking}
              disabled={!bookingDate || isBooking}
            >
              {isBooking ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              申し込む
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Success Dialog */}
      <Dialog open={bookingSuccess} onOpenChange={setBookingSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-sage" />
              申し込みが完了しました
            </DialogTitle>
            <DialogDescription>
              スペースオーナーへの出店相談を送信しました。返信をお待ちください。
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setBookingSuccess(false)}
            >
              閉じる
            </Button>
            <Button className="flex-1 rounded-full" asChild>
              <Link href="/mypage">マイページで確認</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
