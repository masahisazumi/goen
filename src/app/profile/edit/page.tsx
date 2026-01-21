"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Camera,
  Plus,
  X,
  Save,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  User,
} from "lucide-react";
import { Instagram, Twitter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: "",
    description: "",
    website: "",
    instagram: "",
    twitter: "",
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // プロフィールデータを読み込む
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            displayName: data.displayName || "",
            description: data.description || "",
            website: data.website || "",
            instagram: data.instagram || "",
            twitter: data.twitter || "",
          });
          // 画像を設定
          if (data.images && data.images.length > 0) {
            setPreviewImages(data.images.map((img: { url: string }) => img.url));
          }
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session, status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.displayName) {
      setError("表示名は必須です");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "保存に失敗しました");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("保存中にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  // 認証チェック
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/profile/edit");
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
                  プロフィールを更新しました
                </h2>
                <p className="text-gray-600 mb-6">
                  プロフィール情報が正常に保存されました。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    className="rounded-full"
                    onClick={() => setIsSuccess(false)}
                  >
                    続けて編集する
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
                <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
                <p className="mt-2 text-gray-600">
                  あなたの基本情報を編集できます
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                {/* Profile Image */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      プロフィール画像
                    </CardTitle>
                    <CardDescription>
                      あなたのアイコンとなる画像を設定してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        {previewImages.length > 0 ? (
                          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                            <Image
                              src={previewImages[0]}
                              alt="プロフィール画像"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                              onClick={() => setPreviewImages([])}
                            >
                              <X className="h-6 w-6" />
                            </button>
                          </div>
                        ) : (
                          <label className="h-24 w-24 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                            <Plus className="h-6 w-6 text-gray-400" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  setPreviewImages([url]);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>推奨: 正方形の画像</p>
                        <p className="text-xs mt-1">※画像アップロードは準備中です</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Info */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      基本情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">
                        表示名 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        placeholder="山田 太郎"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="rounded-xl"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        サービス上で表示される名前です
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">自己紹介</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="自己紹介を入力してください..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="rounded-xl min-h-[120px] resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        300文字以内で入力してください
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      SNS・ウェブサイト
                    </CardTitle>
                    <CardDescription>
                      任意で登録できます
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
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

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 rounded-full"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        保存する
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
