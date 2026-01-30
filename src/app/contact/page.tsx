"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  FileQuestion,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inquiryTypes = [
  { value: "general", label: "一般的なお問い合わせ" },
  { value: "account", label: "アカウントについて" },
  { value: "matching", label: "マッチングについて" },
  { value: "payment", label: "お支払いについて" },
  { value: "report", label: "トラブル・報告" },
  { value: "other", label: "その他" },
];

const faqItems = [
  {
    question: "利用料金はかかりますか？",
    answer: "基本的な会員登録と閲覧は無料です。マッチング成立時に手数料が発生します。",
  },
  {
    question: "本人確認は必要ですか？",
    answer:
      "安心・安全なサービス提供のため、本人確認をお願いしています。確認済みユーザーには認証バッジが表示されます。",
  },
  {
    question: "キャンセルはできますか？",
    answer:
      "出店日の7日前までは無料でキャンセル可能です。それ以降はキャンセル料が発生する場合があります。",
  },
];

export default function ContactPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "送信に失敗しました");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center px-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-light mb-6">
              <CheckCircle className="h-8 w-8 text-sage" />
            </div>
            <h1 className="text-2xl font-bold mb-3">
              お問い合わせを受け付けました
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              ご連絡いただきありがとうございます。
              <br />
              内容を確認の上、2〜3営業日以内にご返信いたします。
            </p>
            <Button className="rounded-full" asChild>
              <Link href="/">トップページに戻る</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold">お問い合わせ</h1>
            <p className="mt-3 text-muted-foreground">
              ご質問やご不明点がございましたら、お気軽にお問い合わせください
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    お問い合わせフォーム
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">お名前 *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="山田 花子"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>お問い合わせ種別 *</Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="種別を選択してください" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">件名 *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="お問い合わせの件名"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">お問い合わせ内容 *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="お問い合わせ内容をご記入ください..."
                        value={formData.message}
                        onChange={handleInputChange}
                        className="rounded-xl min-h-[180px] resize-none"
                        required
                      />
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        お問い合わせへの返信は、通常2〜3営業日以内にメールにてお送りいたします。
                        お急ぎの場合は、件名にその旨をご記載ください。
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "送信中..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          送信する
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">お問い合わせ先</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-dusty-pink-light flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-dusty-pink" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">メール</p>
                      <p className="text-sm text-muted-foreground">
                        support@goen.example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-sage" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">対応時間</p>
                      <p className="text-sm text-muted-foreground">
                        平日 10:00〜18:00
                        <br />
                        （土日祝日を除く）
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-primary" />
                    よくある質問
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium text-sm">{item.question}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full rounded-full mt-4"
                    asChild
                  >
                    <Link href="/faq">すべてのFAQを見る</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
