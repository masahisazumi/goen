"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  Link as LinkIcon,
  Unlink,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LinkedAccount {
  id: string;
  provider: string;
  providerName: string;
  isLinked: boolean;
}

const availableProviders = [
  {
    id: "google",
    name: "Google",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    bgColor: "bg-white",
    textColor: "text-gray-700",
    borderColor: "border-gray-300",
  },
  {
    id: "line",
    name: "LINE",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
    bgColor: "bg-[#00B900]",
    textColor: "text-white",
    borderColor: "border-[#00B900]",
  },
];

export default function AccountSettingsPage() {
  const searchParams = useSearchParams();
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState<string | null>(null);
  const [unlinkAccountId, setUnlinkAccountId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // URLパラメータからメッセージを取得
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "linked") {
      setMessage({ type: "success", text: "アカウントを連携しました" });
      // リンクモードのCookieを削除
      fetch("/api/accounts/link/start", { method: "DELETE" }).catch(() => {});
      // URLからパラメータを削除
      window.history.replaceState({}, "", "/settings/account");
    } else if (error === "already_linked") {
      setMessage({ type: "error", text: "このアカウントは既に別のユーザーに連携されています" });
      fetch("/api/accounts/link/start", { method: "DELETE" }).catch(() => {});
      window.history.replaceState({}, "", "/settings/account");
    } else if (error === "link_failed") {
      setMessage({ type: "error", text: "アカウント連携に失敗しました" });
      fetch("/api/accounts/link/start", { method: "DELETE" }).catch(() => {});
      window.history.replaceState({}, "", "/settings/account");
    }
  }, [searchParams]);

  // 連携済みアカウントを取得
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch("/api/accounts");
        if (res.ok) {
          const data = await res.json();
          setLinkedAccounts(data);
        }
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleLinkAccount = async (provider: string) => {
    setIsLinking(provider);
    try {
      // アカウントリンクモードを開始
      const res = await fetch("/api/accounts/link/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      if (!res.ok) {
        throw new Error("Failed to start link mode");
      }

      // OAuth認証を開始
      await signIn(provider, { callbackUrl: "/settings/account" });
    } catch (error) {
      console.error("Link account error:", error);
      setMessage({ type: "error", text: "アカウント連携の開始に失敗しました" });
      setIsLinking(null);
    }
  };

  const handleUnlinkAccount = async () => {
    if (!unlinkAccountId) return;

    try {
      const res = await fetch(`/api/accounts?accountId=${unlinkAccountId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "連携解除に失敗しました" });
        return;
      }

      setLinkedAccounts((prev) => prev.filter((a) => a.id !== unlinkAccountId));
      setMessage({ type: "success", text: "アカウント連携を解除しました" });
    } catch (error) {
      console.error("Unlink account error:", error);
      setMessage({ type: "error", text: "連携解除に失敗しました" });
    } finally {
      setUnlinkAccountId(null);
    }
  };

  const isProviderLinked = (providerId: string) => {
    return linkedAccounts.some((a) => a.provider === providerId);
  };

  const getLinkedAccountId = (providerId: string) => {
    return linkedAccounts.find((a) => a.provider === providerId)?.id;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold">アカウント連携</h1>
            <p className="mt-2 text-muted-foreground">
              外部サービスとの連携を管理します
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-current hover:opacity-70"
              >
                ×
              </button>
            </div>
          )}

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                連携サービス
              </CardTitle>
              <CardDescription>
                複数のサービスを連携すると、どちらでもログインできるようになります
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                availableProviders.map((provider) => {
                  const linked = isProviderLinked(provider.id);
                  const accountId = getLinkedAccountId(provider.id);

                  return (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${provider.bgColor} ${provider.textColor} border ${provider.borderColor}`}
                        >
                          {provider.icon}
                        </div>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          {linked && (
                            <Badge variant="secondary" className="mt-1">
                              連携済み
                            </Badge>
                          )}
                        </div>
                      </div>

                      {linked ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => setUnlinkAccountId(accountId || null)}
                        >
                          <Unlink className="h-4 w-4 mr-1" />
                          解除
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleLinkAccount(provider.id)}
                          disabled={isLinking === provider.id}
                        >
                          {isLinking === provider.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <LinkIcon className="h-4 w-4 mr-1" />
                          )}
                          連携する
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <div className="mt-6 p-4 rounded-xl bg-muted/50">
            <h3 className="font-medium text-sm">連携について</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>・複数のサービスを連携すると、どちらでもログインできます</li>
              <li>・最後のログイン方法は解除できません</li>
              <li>・連携を解除しても、アカウントは削除されません</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={!!unlinkAccountId} onOpenChange={() => setUnlinkAccountId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>連携を解除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作を行うと、このサービスでログインできなくなります。
              他のログイン方法が設定されていることを確認してください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkAccount}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              解除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
