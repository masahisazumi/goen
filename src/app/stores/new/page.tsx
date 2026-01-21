"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Loader2,
  ImagePlus,
  CheckCircle2,
  Store,
  Globe,
  Instagram,
  Twitter,
  ShieldAlert,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categoryOptions = [
  "キッチンカー",
  "移動販売",
  "ハンドメイド",
  "飲食",
  "スイーツ・カフェ",
  "物販",
  "サービス",
  "その他",
];

const tagOptions = [
  "週末出店可",
  "平日出店可",
  "イベント出店可",
  "長期出店可",
  "土日祝のみ",
  "短期出店OK",
  "初出店歓迎",
];

export default function NewStorePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    area: "",
    website: "",
    instagram: "",
    twitter: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [isVendor, setIsVendor] = useState(false);

  // 役割チェック
  useEffect(() => {
    const checkRole = async () => {
      if (!session?.user) return;
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const userTypes = data.userTypes || [];
          setIsVendor(userTypes.includes("vendor"));
        }
      } catch (error) {
        console.error("Role check error:", error);
      } finally {
        setIsCheckingRole(false);
      }
    };
    if (session) {
      checkRole();
    }
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const selectCategory = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("店舗名は必須です");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: selectedTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "店舗の登録に失敗しました");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("登録中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 認証チェック
  if (status === "loading" || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/stores/new");
    return null;
  }

  // 出店者でない場合はアクセス不可
  if (!isVendor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="rounded-2xl border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto mb-6">
                  <ShieldAlert className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  アクセス権限がありません
                </h2>
                <p className="text-gray-600 mb-6">
                  店舗登録は出店者アカウントのみ利用できます。
                </p>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => router.push("/mypage")}
                >
                  マイページへ戻る
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>

          {isSuccess ? (
            <Card className="rounded-2xl border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  店舗を登録しました
                </h2>
                <p className="text-gray-600 mb-6">
                  店舗情報が正常に登録されました。
                  マイページから確認・編集ができます。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    className="rounded-full"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        description: "",
                        category: "",
                        area: "",
                        website: "",
                        instagram: "",
                        twitter: "",
                      });
                      setSelectedTags([]);
                    }}
                  >
                    続けて登録する
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => router.push("/mypage")}
                  >
                    マイページへ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  店舗を登録
                </h1>
                <p className="mt-2 text-gray-600">
                  あなたの店舗・ビジネスの情報を入力してください
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                {/* 基本情報 */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      基本情報
                    </CardTitle>
                    <CardDescription>
                      店舗の基本的な情報を入力してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        店舗名 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="例: 〇〇キッチンカー"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">店舗紹介</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="店舗の特徴、提供メニュー、こだわりなどをアピールしてください"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="rounded-xl min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 業種カテゴリ */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">業種カテゴリ</CardTitle>
                    <CardDescription>
                      最も当てはまるものを選択してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.map((category) => (
                        <Badge
                          key={category}
                          variant={
                            formData.category === category ? "default" : "outline"
                          }
                          className={`cursor-pointer rounded-full px-4 py-2 transition-colors ${
                            formData.category === category
                              ? "bg-primary hover:bg-primary/90"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => selectCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 出店エリア */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      主な出店エリア
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="area">エリア</Label>
                      <Input
                        id="area"
                        name="area"
                        placeholder="例: 東京都内、神奈川県全域"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="rounded-xl"
                      />
                      <p className="text-xs text-gray-500">
                        出店可能なエリアを記載すると、スペースオーナーに見つけてもらいやすくなります
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* タグ */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">出店スタイル</CardTitle>
                    <CardDescription>
                      該当するものをすべて選択してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tagOptions.map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            selectedTags.includes(tag) ? "default" : "outline"
                          }
                          className={`cursor-pointer rounded-full px-4 py-2 transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-gray-900 hover:bg-gray-800"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* SNS・ウェブサイト */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">SNS・ウェブサイト</CardTitle>
                    <CardDescription>
                      店舗の情報発信先を登録できます（任意）
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        ウェブサイト
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        placeholder="@username"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        X (Twitter)
                      </Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        placeholder="@username"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 画像アップロード（プレースホルダー） */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">店舗画像</CardTitle>
                    <CardDescription>
                      店舗や商品の写真を追加してください（任意）
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                      <ImagePlus className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        画像アップロード機能は準備中です
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        登録後にマイページから追加できます
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 送信ボタン */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        登録中...
                      </>
                    ) : (
                      <>
                        店舗を登録する
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    onClick={() => router.back()}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
