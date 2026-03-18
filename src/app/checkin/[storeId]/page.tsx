"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Store,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function CheckInContent({ storeId }: { storeId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const token = searchParams.get("token");

  const [state, setState] = useState<"loading" | "success" | "error" | "cooldown">("loading");
  const [message, setMessage] = useState("");
  const [storeName, setStoreName] = useState("");
  const [earnedPoints, setEarnedPoints] = useState(0);

  const doCheckIn = useCallback(async () => {
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, token }),
      });

      const data = await res.json();

      if (res.ok) {
        setState("success");
        setStoreName(data.storeName);
        setEarnedPoints(data.points);
      } else if (res.status === 429) {
        setState("cooldown");
        setMessage(data.error);
      } else {
        setState("error");
        setMessage(data.error || "チェックインに失敗しました");
      }
    } catch {
      setState("error");
      setMessage("通信エラーが発生しました");
    }
  }, [storeId, token]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(`/login?callbackUrl=/checkin/${storeId}?token=${token}`);
      return;
    }

    if (!token) {
      setState("error");
      setMessage("無効なチェックインURLです");
      return;
    }

    doCheckIn();
  }, [session, status, storeId, token, router, doCheckIn]);

  if (status === "loading" || state === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">チェックイン中...</p>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-2xl border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">チェックイン完了!</h1>
            <p className="text-white/90">{storeName}</p>
          </div>
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50 rounded-full px-6 py-3 mb-6">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="font-bold text-amber-700">+{earnedPoints} ポイント獲得!</span>
            </div>
            <div className="space-y-3">
              <Button asChild className="w-full rounded-full">
                <Link href={`/store/${storeId}`}>
                  <Store className="h-4 w-4 mr-2" />
                  店舗ページを見る
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/mypage">マイページへ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-2xl border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {state === "cooldown" ? "チェックイン済み" : "エラー"}
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Button asChild className="w-full rounded-full">
              <Link href={`/store/${storeId}`}>
                <Store className="h-4 w-4 mr-2" />
                店舗ページを見る
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/">ホームへ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckInPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = use(params);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }
      >
        <CheckInContent storeId={storeId} />
      </Suspense>
      <Footer />
    </div>
  );
}
