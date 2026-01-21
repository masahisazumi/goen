"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Heart,
  MessageCircle,
  Calendar,
  Star,
  ChevronRight,
  Edit,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  MapPin,
  Loader2,
  Link2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Profile {
  displayName: string;
  description?: string;
  category?: string;
  area?: string;
  isVerified: boolean;
}

interface Favorite {
  id: string;
  space: {
    id: string;
    name: string;
    location: string;
    price?: string;
    images: { url: string }[];
    _count: { reviews: number };
  };
}

interface Booking {
  id: string;
  date: string;
  status: string;
  space?: { id: string; name: string; location: string };
}

interface Review {
  id: string;
  rating: number;
  content?: string;
  createdAt: string;
  author: { id: string; name?: string; image?: string };
  space?: { id: string; name: string };
}

const menuItems = [
  { icon: User, label: "プロフィール編集", href: "/profile/edit" },
  { icon: Link2, label: "アカウント連携", href: "/settings/account" },
  { icon: Bell, label: "通知設定", href: "/settings/notifications" },
  { icon: Shield, label: "本人確認", href: "/settings/verification", badge: "未確認" },
  { icon: CreditCard, label: "お支払い方法", href: "/settings/payment" },
  { icon: HelpCircle, label: "ヘルプ・FAQ", href: "/faq" },
];


export default function MyPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("favorites");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ favorites: 0, messages: 0, bookings: 0, reviews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      setIsLoading(true);

      try {
        const [profileRes, favoritesRes, bookingsRes, reviewsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/favorites"),
          fetch("/api/bookings"),
          fetch(`/api/reviews?targetId=${session.user.id}`),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (favoritesRes.ok) {
          const favoritesData = await favoritesRes.json();
          setFavorites(favoritesData);
          setStats(prev => ({ ...prev, favorites: favoritesData.length }));
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
          setStats(prev => ({ ...prev, bookings: bookingsData.length }));
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.reviews || []);
          setStats(prev => ({ ...prev, reviews: reviewsData.total || 0 }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const userProfile = {
    name: profile?.displayName || session?.user?.name || "名前未設定",
    email: session?.user?.email || "",
    type: "vendor" as const,
    avatar: session?.user?.image || "",
    isVerified: profile?.isVerified || false,
    location: profile?.area || "未設定",
    category: profile?.category || "未設定",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={userProfile.avatar} />
                        <AvatarFallback className="bg-dusty-pink-light text-dusty-pink text-2xl">
                          {userProfile.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                        asChild
                      >
                        <Link href="/profile/edit">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <h2 className="mt-4 font-semibold text-lg">{userProfile.name}</h2>
                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="rounded-full">
                        {userProfile.type === "vendor" ? "出店者" : "オーナー"}
                      </Badge>
                      {!userProfile.isVerified && (
                        <Badge variant="outline" className="rounded-full text-yellow-600">
                          未認証
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{userProfile.location}</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); setActiveTab("favorites"); }}
                      className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Heart className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-semibold">{stats.favorites}</span>
                      <span className="text-xs text-muted-foreground">お気に入り</span>
                    </Link>
                    <Link
                      href="/messages"
                      className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-semibold">{stats.messages}</span>
                      <span className="text-xs text-muted-foreground">メッセージ</span>
                    </Link>
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); setActiveTab("bookings"); }}
                      className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Calendar className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-semibold">{stats.bookings}</span>
                      <span className="text-xs text-muted-foreground">予約・申請</span>
                    </Link>
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); setActiveTab("reviews"); }}
                      className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Star className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-semibold">{stats.reviews}</span>
                      <span className="text-xs text-muted-foreground">レビュー</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Menu */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                    <Separator className="my-2" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors w-full text-left text-muted-foreground"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-sm font-medium">ログアウト</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted rounded-full p-1 mb-6">
                  <TabsTrigger value="favorites" className="rounded-full">
                    <Heart className="h-4 w-4 mr-2" />
                    お気に入り
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="rounded-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    予約・申請
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-full">
                    <Star className="h-4 w-4 mr-2" />
                    レビュー
                  </TabsTrigger>
                </TabsList>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">お気に入り一覧</h2>
                  </div>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground/30" />
                      <p className="mt-4 text-muted-foreground">お気に入りはまだありません</p>
                      <Button asChild className="mt-4 rounded-full">
                        <Link href="/search?type=space">スペースを探す</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((fav) => (
                        <Card
                          key={fav.id}
                          className="border-0 shadow-sm rounded-2xl overflow-hidden"
                        >
                          <Link href={`/space/${fav.space.id}`}>
                            <div className="flex">
                              <div className="relative w-32 h-32 shrink-0 bg-muted">
                                {fav.space.images?.[0]?.url && (
                                  <Image
                                    src={fav.space.images[0].url}
                                    alt={fav.space.name}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <CardContent className="p-4 flex-1">
                                <h3 className="font-semibold line-clamp-1">
                                  {fav.space.name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{fav.space.location}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    ({fav.space._count?.reviews || 0}件のレビュー)
                                  </span>
                                </div>
                                {fav.space.price && (
                                  <p className="mt-2 text-sm font-semibold text-primary">
                                    {fav.space.price}
                                  </p>
                                )}
                              </CardContent>
                            </div>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-6">
                  <h2 className="text-xl font-semibold">予約・申請履歴</h2>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30" />
                      <p className="mt-4 text-muted-foreground">予約・申請履歴はまだありません</p>
                      <Button asChild className="mt-4 rounded-full">
                        <Link href="/search?type=space">スペースを探す</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card
                          key={booking.id}
                          className="border-0 shadow-sm rounded-2xl"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                                <Calendar className="h-8 w-8 text-muted-foreground/50" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold">
                                      {booking.space?.name || "スペース"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      出店希望日: {new Date(booking.date).toLocaleDateString("ja-JP")}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      booking.status === "confirmed"
                                        ? "default"
                                        : booking.status === "pending"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="rounded-full"
                                  >
                                    {booking.status === "confirmed"
                                      ? "確定"
                                      : booking.status === "pending"
                                      ? "申請中"
                                      : booking.status === "cancelled"
                                      ? "キャンセル"
                                      : "完了"}
                                  </Badge>
                                </div>
                                <div className="flex gap-2 mt-3">
                                  {booking.status === "confirmed" && (
                                    <Button
                                      size="sm"
                                      className="rounded-full"
                                      asChild
                                    >
                                      <Link href="/messages">
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        メッセージ
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">いただいたレビュー</h2>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-soft-coral text-soft-coral" />
                      <span className="text-muted-foreground">({stats.reviews}件)</span>
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 mx-auto text-muted-foreground/30" />
                      <p className="mt-4 text-muted-foreground">レビューはまだありません</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card
                          key={review.id}
                          className="border-0 shadow-sm rounded-2xl"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={review.author.image || ""} />
                                <AvatarFallback className="bg-sage-light text-sage">
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
                                      className="h-4 w-4 fill-soft-coral text-soft-coral"
                                    />
                                  ))}
                                </div>
                                {review.content && (
                                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                    {review.content}
                                  </p>
                                )}
                                {review.space && (
                                  <p className="mt-2 text-xs text-muted-foreground">
                                    スペース: {review.space.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
