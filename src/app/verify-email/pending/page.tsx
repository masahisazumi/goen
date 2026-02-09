"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyEmailPendingPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });

      if (res.ok) {
        setResendStatus("success");
      } else {
        const data = await res.json();
        setResendStatus("error");
        setErrorMessage(data.error || "送信に失敗しました");
      }
    } catch {
      setResendStatus("error");
      setErrorMessage("送信中にエラーが発生しました");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl border-0 shadow-md">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-amber-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">メールアドレスの確認が必要です</h2>
                <p className="text-gray-600 text-sm">
                  ご登録いただいたメールアドレスに確認メールを送信しています。
                  メール内のリンクをクリックして、アカウントを有効にしてください。
                </p>
              </div>

              {resendStatus === "success" && (
                <div className="flex items-center gap-2 justify-center text-green-600 bg-green-50 p-3 rounded-xl">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">確認メールを再送しました</span>
                </div>
              )}

              {resendStatus === "error" && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleResend}
                  disabled={isResending || resendStatus === "success"}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {isResending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  確認メールを再送する
                </Button>

                <Button asChild variant="outline" className="w-full rounded-full" size="lg">
                  <Link href="/mypage">マイページへ戻る</Link>
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                メールが届かない場合は、迷惑メールフォルダをご確認ください。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
