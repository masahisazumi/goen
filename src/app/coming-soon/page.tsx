"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Truck,
  MapPin,
  Users,
  Shield,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "簡単マッチング",
    description: "出店者とスペースオーナーを最適にマッチング",
    color: "bg-food-orange-light text-food-orange",
  },
  {
    icon: Shield,
    title: "安心・安全",
    description: "本人確認済みユーザーのみが利用可能",
    color: "bg-fresh-green-light text-fresh-green",
  },
  {
    icon: MapPin,
    title: "全国対応",
    description: "日本全国のスペースを検索・掲載可能",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Sparkles,
    title: "無料で利用開始",
    description: "登録料・月額費用は一切かかりません",
    color: "bg-secondary/20 text-secondary",
  },
];

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !userType) {
      setError("メールアドレスと利用目的を入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/pre-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "登録に失敗しました");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-food-orange-light/30 via-background to-fresh-green-light/20">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-warm-brown">てんむすび</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                  <Sparkles className="h-4 w-4" />
                  Coming Soon
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
                  キッチンカーと
                  <br />
                  スペースをつなぐ
                  <br />
                  <span className="text-primary">新しいマッチング</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  てんむすびは、キッチンカーやハンドメイド作家と、
                  <br className="hidden sm:block" />
                  空きスペースを持つオーナーをつなぐ
                  <br className="hidden sm:block" />
                  出店マッチングサービスです。
                </p>
                <p className="mt-4 text-base text-muted-foreground">
                  サービス開始時にお知らせをお届けします。
                  <br />
                  先行登録で最新情報をいち早くゲット!
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-fresh-green-light/50 border-4 border-white shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80"
                    alt="キッチンカーの様子"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card p-4 shadow-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">先行登録受付中</p>
                      <p className="text-xs text-muted-foreground">無料・簡単登録</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 px-4 bg-white/50">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold md:text-3xl">
                てんむすびの特徴
              </h2>
              <p className="mt-3 text-muted-foreground">
                出店ビジネスをもっと簡単に、もっと安心に
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border border-border bg-card shadow-sm rounded-2xl hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}
                      >
                        <Icon className="h-7 w-7" />
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

        {/* Registration Form Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-xl">
            <Card className="rounded-3xl border-0 shadow-xl bg-card">
              <CardContent className="p-8 md:p-10">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fresh-green-light mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-fresh-green" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      登録完了しました!
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      ご登録ありがとうございます。
                      <br />
                      サービス開始時にメールでお知らせいたします。
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold">先行登録</h2>
                      <p className="mt-2 text-muted-foreground">
                        サービス開始時に優先的にご案内します
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">
                          {error}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-xl h-12"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>ご利用目的</Label>
                        <RadioGroup
                          value={userType}
                          onValueChange={setUserType}
                          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                          disabled={isLoading}
                        >
                          <Label
                            htmlFor="vendor"
                            className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                              userType === "vendor"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value="vendor" id="vendor" />
                            <div>
                              <div className="font-medium">出店者として</div>
                              <div className="text-xs text-muted-foreground">
                                スペースを探したい
                              </div>
                            </div>
                          </Label>
                          <Label
                            htmlFor="owner"
                            className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                              userType === "owner"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value="owner" id="owner" />
                            <div>
                              <div className="font-medium">オーナーとして</div>
                              <div className="text-xs text-muted-foreground">
                                スペースを貸したい
                              </div>
                            </div>
                          </Label>
                        </RadioGroup>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-xl h-12 text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            登録中...
                          </>
                        ) : (
                          "先行登録する（無料）"
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        登録することで、サービス開始のお知らせを受け取ることに同意したものとみなされます。
                      </p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-warm-brown">てんむすび</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} てんむすび. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
