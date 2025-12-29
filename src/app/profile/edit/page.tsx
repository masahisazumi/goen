"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Camera,
  Plus,
  X,
  Save,
  MapPin,
  Tag,
  FileText,
  Link as LinkIcon,
  Instagram,
  Twitter,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "キッチンカー",
  "ハンドメイド",
  "アクセサリー",
  "雑貨",
  "フード",
  "アート",
  "ファッション",
  "フラワー",
  "レザー",
  "スイーツ",
];

const areas = [
  "北海道",
  "東北",
  "関東",
  "中部",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄",
];

export default function ProfileEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    category: "",
    area: "",
    description: "",
    website: "",
    instagram: "",
    twitter: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 5
        ? [...prev, tag]
        : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/mypage");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">プロフィール編集</h1>
            <p className="mt-2 text-muted-foreground">
              あなたの魅力をアピールしましょう
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Images */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  プロフィール画像
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {previewImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
                    >
                      <Image
                        src={image}
                        alt={`プロフィール画像 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          setPreviewImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {previewImages.length < 4 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">
                        追加
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setPreviewImages((prev) => [...prev, url]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  最大4枚まで登録できます。最初の画像がメイン画像になります。
                </p>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">表示名 *</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="Cafe Maru"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="rounded-xl"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    お店や活動の名前を入力してください
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>カテゴリー *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="カテゴリーを選択" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>活動エリア *</Label>
                    <Select
                      value={formData.area}
                      onValueChange={(value) => handleSelectChange("area", value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="エリアを選択" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">自己紹介 *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="あなたの活動内容や、こだわり、想いなどを書いてください..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="rounded-xl min-h-[150px] resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    500文字以内で入力してください
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  タグ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  あなたの活動に当てはまるタグを選んでください（最大5つ）
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                asChild
              >
                <Link href="/mypage">キャンセル</Link>
              </Button>
              <Button type="submit" className="rounded-full">
                <Save className="mr-2 h-4 w-4" />
                保存する
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
