"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Settings,
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
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { vendors, spaces } from "@/lib/dummy-data";

const menuItems = [
  { icon: User, label: "プロフィール編集", href: "/profile/edit" },
  { icon: Bell, label: "通知設定", href: "/settings/notifications" },
  { icon: Shield, label: "本人確認", href: "/settings/verification", badge: "未確認" },
  { icon: CreditCard, label: "お支払い方法", href: "/settings/payment" },
  { icon: HelpCircle, label: "ヘルプ・FAQ", href: "/faq" },
];

const stats = [
  { label: "お気に入り", value: 12, icon: Heart },
  { label: "メッセージ", value: 5, icon: MessageCircle, badge: 2 },
  { label: "予約・申請", value: 3, icon: Calendar },
  { label: "レビュー", value: 8, icon: Star },
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("favorites");

  const userProfile = {
    name: "Cafe Maru",
    email: "cafe.maru@example.com",
    type: "vendor" as const,
    avatar: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=200&q=80",
    isVerified: false,
    location: "東京都渋谷区",
    category: "キッチンカー",
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
                    {stats.map((stat) => (
                      <Link
                        key={stat.label}
                        href={
                          stat.label === "メッセージ"
                            ? "/messages"
                            : `/mypage?tab=${stat.label.toLowerCase()}`
                        }
                        className="flex flex-col items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors relative"
                      >
                        <stat.icon className="h-5 w-5 text-primary mb-1" />
                        <span className="text-lg font-semibold">{stat.value}</span>
                        <span className="text-xs text-muted-foreground">
                          {stat.label}
                        </span>
                        {stat.badge && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {stat.badge}
                          </span>
                        )}
                      </Link>
                    ))}
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
                    <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors w-full text-left text-muted-foreground">
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
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      編集
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {spaces.slice(0, 4).map((space) => (
                      <Card
                        key={space.id}
                        className="border-0 shadow-sm rounded-2xl overflow-hidden"
                      >
                        <Link href={`/space/${space.id}`}>
                          <div className="flex">
                            <div className="relative w-32 h-32 shrink-0">
                              <Image
                                src={space.image}
                                alt={space.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="p-4 flex-1">
                              <h3 className="font-semibold line-clamp-1">
                                {space.name}
                              </h3>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{space.location}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <Star className="h-3.5 w-3.5 fill-soft-coral text-soft-coral" />
                                <span className="text-sm font-medium">
                                  {space.rating}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({space.reviewCount})
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-semibold text-primary">
                                {space.price}
                              </p>
                            </CardContent>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-6">
                  <h2 className="text-xl font-semibold">予約・申請履歴</h2>
                  <div className="space-y-4">
                    {[
                      {
                        id: "b1",
                        space: spaces[0],
                        status: "pending",
                        date: "2024年2月10日",
                      },
                      {
                        id: "b2",
                        space: spaces[2],
                        status: "confirmed",
                        date: "2024年2月5日",
                      },
                      {
                        id: "b3",
                        space: spaces[4],
                        status: "completed",
                        date: "2024年1月28日",
                      },
                    ].map((booking) => (
                      <Card
                        key={booking.id}
                        className="border-0 shadow-sm rounded-2xl"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={booking.space.image}
                                alt={booking.space.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">
                                    {booking.space.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    出店希望日: {booking.date}
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
                                    : "完了"}
                                </Badge>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full"
                                >
                                  詳細を見る
                                </Button>
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
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">いただいたレビュー</h2>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-soft-coral text-soft-coral" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-muted-foreground">(8件)</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        id: "r1",
                        author: "代官山カフェ前スペース",
                        avatar:
                          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80",
                        rating: 5,
                        date: "2024年1月28日",
                        content:
                          "とても素敵な出店者さんでした！コーヒーも美味しく、お客様からも大好評でした。また出店をお願いしたいです。",
                      },
                      {
                        id: "r2",
                        author: "横浜赤レンガ広場",
                        avatar:
                          "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=100&q=80",
                        rating: 5,
                        date: "2024年1月15日",
                        content:
                          "準備も片付けもスムーズで、コミュニケーションも取りやすかったです。接客も丁寧でした。",
                      },
                    ].map((review) => (
                      <Card
                        key={review.id}
                        className="border-0 shadow-sm rounded-2xl"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback className="bg-sage-light text-sage">
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
                                    className="h-4 w-4 fill-soft-coral text-soft-coral"
                                  />
                                ))}
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                {review.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
