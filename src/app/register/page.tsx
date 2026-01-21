"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Truck, Eye, EyeOff, ArrowRight, Store, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type UserType = "vendor" | "owner" | null;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    agreeTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      // Register user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          userType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登録に失敗しました");
        return;
      }

      // Auto login after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("ログインに失敗しました。ログインページからお試しください。");
        return;
      }

      router.push("/profile/edit");
    } catch {
      setError("登録中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">てんむすび</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold">会員登録</h1>
                <p className="mt-2 text-muted-foreground">
                  あなたの立場を選んでください
                </p>
              </div>

              <div className="grid gap-4">
                <Card
                  className={`cursor-pointer transition-all rounded-2xl border-2 hover:border-gray-900 hover:shadow-md ${
                    userType === "vendor" ? "border-gray-900 bg-gray-50" : "border-gray-200"
                  }`}
                  onClick={() => handleUserTypeSelect("vendor")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shrink-0">
                        <Store className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">出店者として登録</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          キッチンカー、ハンドメイド作家、
                          フード販売など、出店場所を探している方
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all rounded-2xl border-2 hover:border-gray-900 hover:shadow-md ${
                    userType === "owner" ? "border-gray-900 bg-gray-50" : "border-gray-200"
                  }`}
                  onClick={() => handleUserTypeSelect("owner")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">スペースオーナーとして登録</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          空きスペースを提供したい方、
                          イベント・マルシェを主催したい方
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                すでにアカウントをお持ちの方は
                <Link href="/login" className="text-primary hover:underline ml-1">
                  ログイン
                </Link>
              </p>
            </div>
          ) : (
            <Card className="rounded-2xl border-0 shadow-md">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">アカウント作成</CardTitle>
                <CardDescription>
                  {userType === "vendor" ? "出店者" : "スペースオーナー"}として登録
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
                    <Label htmlFor="name">お名前（ニックネーム可）</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="山田 花子"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="8文字以上"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="rounded-xl pr-10"
                        required
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirm">パスワード（確認）</Label>
                    <Input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      placeholder="もう一度入力してください"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      required
                    />
                    <Label htmlFor="agreeTerms" className="text-sm font-normal text-muted-foreground">
                      <Link href="/terms" className="text-primary hover:underline">
                        利用規約
                      </Link>
                      および
                      <Link href="/privacy" className="text-primary hover:underline">
                        プライバシーポリシー
                      </Link>
                      に同意します
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        登録中...
                      </>
                    ) : (
                      <>
                        無料で登録する
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">または</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    size="lg"
                    onClick={() => signIn("google", { callbackUrl: "/profile/edit" })}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Googleで登録
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    className="text-sm"
                    onClick={() => setStep(1)}
                  >
                    戻る
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    アカウントをお持ちの方は
                    <Link href="/login" className="text-primary hover:underline ml-1">
                      ログイン
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center bg-white border-t border-gray-100">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} てんむすび. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
