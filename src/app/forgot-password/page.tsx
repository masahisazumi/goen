"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "送信に失敗しました");
      }
    } catch {
      setError("送信中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="py-6 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-4 w-fit">
            <Logo size={72} />
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-wide text-[#d35f2d]">てんむすび</span>
              <span className="text-xs text-[#8b7355] tracking-wider">出店者 × スペース マッチング</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl border-0 shadow-md">
            {!isSent ? (
              <>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">パスワードをリセット</CardTitle>
                  <CardDescription>
                    ご登録のメールアドレスにリセット用のリンクを送信します
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">メールアドレス</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="mr-2 h-4 w-4" />
                      )}
                      リセットメールを送信
                    </Button>
                  </form>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      ログインに戻る
                    </Link>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">メールを送信しました</h2>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">{email}</span> にパスワードリセット用のリンクを送信しました。
                  メールをご確認ください。
                </p>
                <p className="text-xs text-gray-500">
                  メールが届かない場合は、迷惑メールフォルダをご確認ください。
                </p>
                <Button asChild variant="outline" className="w-full rounded-full" size="lg">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ログインに戻る
                  </Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </main>

      <footer className="py-6 text-center bg-white border-t border-gray-100">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} てんむすび. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
