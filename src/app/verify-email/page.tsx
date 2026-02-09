"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("トークンが見つかりません");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json();
          setStatus("error");
          setErrorMessage(data.error || "確認に失敗しました");
        }
      } catch {
        setStatus("error");
        setErrorMessage("確認処理中にエラーが発生しました");
      }
    };

    verify();
  }, [token]);

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
            <CardContent className="p-8 text-center">
              {status === "loading" && (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto" />
                  <p className="text-gray-600">メールアドレスを確認中...</p>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-900">メールアドレスが確認されました</h2>
                  <p className="text-gray-600">すべての機能をご利用いただけます。</p>
                  <Button asChild className="w-full rounded-full" size="lg">
                    <Link href="/mypage">マイページへ</Link>
                  </Button>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-4">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <h2 className="text-xl font-bold text-gray-900">確認に失敗しました</h2>
                  <p className="text-gray-600">{errorMessage}</p>
                  <div className="space-y-2">
                    <Button asChild className="w-full rounded-full" size="lg">
                      <Link href="/verify-email/pending">確認メールを再送する</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-full" size="lg">
                      <Link href="/mypage">マイページへ</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-6 text-center bg-white border-t border-gray-100">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} てんむすび. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
