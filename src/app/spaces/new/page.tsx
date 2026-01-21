"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Loader2,
  ImagePlus,
  X,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const facilityOptions = [
  "駐車場あり",
  "電源あり",
  "水道あり",
  "トイレあり",
  "屋根あり",
  "Wi-Fiあり",
  "テーブル・椅子貸出",
  "看板設置可",
];

const tagOptions = [
  "イベント会場",
  "商業施設",
  "オフィス街",
  "駅近",
  "住宅街",
  "公園・広場",
  "駐車場",
  "マルシェ向け",
];

export default function NewSpacePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    address: "",
    capacity: "",
    price: "",
    openingHours: "",
    closedDays: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

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

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.location) {
      setError("スペース名と所在地は必須です");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: selectedTags,
          facilities: selectedFacilities,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "スペースの登録に失敗しました");
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
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/spaces/new");
    return null;
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
                  スペースを登録しました
                </h2>
                <p className="text-gray-600 mb-6">
                  スペースが正常に登録されました。
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
                        location: "",
                        address: "",
                        capacity: "",
                        price: "",
                        openingHours: "",
                        closedDays: "",
                      });
                      setSelectedTags([]);
                      setSelectedFacilities([]);
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
                  スペースを登録
                </h1>
                <p className="mt-2 text-gray-600">
                  出店者に提供したいスペースの情報を入力してください
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
                    <CardTitle className="text-lg">基本情報</CardTitle>
                    <CardDescription>
                      スペースの基本的な情報を入力してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        スペース名 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="例: 〇〇駐車場スペース"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">スペース紹介</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="スペースの特徴やアピールポイントを入力してください"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="rounded-xl min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 所在地 */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      所在地
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        エリア <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="例: 東京都渋谷区"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">住所（詳細）</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="例: 渋谷1-2-3 〇〇ビル前"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 利用条件 */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">利用条件</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="capacity">収容台数・広さ</Label>
                        <Input
                          id="capacity"
                          name="capacity"
                          placeholder="例: キッチンカー2台まで"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">利用料金</Label>
                        <Input
                          id="price"
                          name="price"
                          placeholder="例: 5,000円/日"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="openingHours">営業時間</Label>
                        <Input
                          id="openingHours"
                          name="openingHours"
                          placeholder="例: 10:00〜18:00"
                          value={formData.openingHours}
                          onChange={handleInputChange}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="closedDays">定休日</Label>
                        <Input
                          id="closedDays"
                          name="closedDays"
                          placeholder="例: 土日祝"
                          value={formData.closedDays}
                          onChange={handleInputChange}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 設備 */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">設備・環境</CardTitle>
                    <CardDescription>
                      該当するものをすべて選択してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {facilityOptions.map((facility) => (
                        <Badge
                          key={facility}
                          variant={
                            selectedFacilities.includes(facility)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer rounded-full px-4 py-2 transition-colors ${
                            selectedFacilities.includes(facility)
                              ? "bg-gray-900 hover:bg-gray-800"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => toggleFacility(facility)}
                        >
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* タグ */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">カテゴリ・タグ</CardTitle>
                    <CardDescription>
                      スペースの種類を選択してください
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
                              ? "bg-primary hover:bg-primary/90"
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

                {/* 画像アップロード（プレースホルダー） */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">スペース画像</CardTitle>
                    <CardDescription>
                      スペースの写真を追加してください（任意）
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
                        スペースを登録する
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
