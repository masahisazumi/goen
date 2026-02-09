"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Loader2,
  ImagePlus,
  CheckCircle2,
  Trash2,
  Store,
  Globe,
  Instagram,
  Twitter,
  X,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface StoreImageData {
  id: string;
  url: string;
}

interface StoreData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  area?: string;
  tags?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  isActive: boolean;
  images?: StoreImageData[];
}

export default function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    isActive: true,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<StoreImageData[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // 店舗データを取得
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`/api/stores/${id}`);
        if (!res.ok) {
          setError("店舗が見つかりません");
          return;
        }
        const store: StoreData = await res.json();

        setFormData({
          name: store.name || "",
          description: store.description || "",
          category: store.category || "",
          area: store.area || "",
          website: store.website || "",
          instagram: store.instagram || "",
          twitter: store.twitter || "",
          isActive: store.isActive,
        });

        // 画像を設定
        if (store.images) {
          setExistingImages(store.images);
        }

        // タグをパース
        if (store.tags) {
          try {
            setSelectedTags(JSON.parse(store.tags));
          } catch {
            setSelectedTags([]);
          }
        }
      } catch {
        setError("店舗の読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchStore();
    }
  }, [id, session]);

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

    setIsSaving(true);

    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: selectedTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "店舗の更新に失敗しました");
        return;
      }

      // Upload new images
      if (newImageFiles.length > 0) {
        for (const file of newImageFiles) {
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("type", "store");
          uploadData.append("targetId", id);
          await fetch("/api/upload", { method: "POST", body: uploadData });
        }
        setNewImageFiles([]);
        setNewImagePreviews([]);
      }

      setIsSuccess(true);
    } catch {
      setError("更新中にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "店舗の削除に失敗しました");
        return;
      }

      router.push("/mypage");
    } catch {
      setError("削除中にエラーが発生しました");
    } finally {
      setIsDeleting(false);
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
    router.push(`/login?callbackUrl=/stores/${id}/edit`);
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
                  店舗を更新しました
                </h2>
                <p className="text-gray-600 mb-6">
                  店舗情報が正常に更新されました。
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
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    店舗を編集
                  </h1>
                  <p className="mt-2 text-gray-600">
                    店舗の情報を更新してください
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      削除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>店舗を削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。店舗に関連するすべてのデータも削除されます。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            削除中...
                          </>
                        ) : (
                          "削除する"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                {/* 公開設定 */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">公開設定</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">店舗を公開する</p>
                        <p className="text-sm text-gray-500">
                          オフにすると検索結果に表示されなくなります
                        </p>
                      </div>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, isActive: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

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

                {/* 画像アップロード */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">店舗画像</CardTitle>
                    <CardDescription>
                      店舗や商品の写真を追加してください（任意・最大5枚）
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <Image
                            src={img.url}
                            alt="店舗画像"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                            onClick={async () => {
                              try {
                                await fetch(`/api/upload/${img.id}?type=store`, { method: "DELETE" });
                                setExistingImages((prev) => prev.filter((i) => i.id !== img.id));
                              } catch {
                                setError("画像の削除に失敗しました");
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {newImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <Image
                            src={preview}
                            alt={`新しい画像 ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                            onClick={() => {
                              setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
                              setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {existingImages.length + newImagePreviews.length < 5 && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                          <ImagePlus className="h-8 w-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">追加</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  setError("ファイルサイズは5MB以下にしてください");
                                  return;
                                }
                                setNewImageFiles((prev) => [...prev, file]);
                                setNewImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG, WebP, GIF（各5MB以下）
                    </p>
                  </CardContent>
                </Card>

                {/* 送信ボタン */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 rounded-full"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        更新中...
                      </>
                    ) : (
                      <>
                        変更を保存する
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
