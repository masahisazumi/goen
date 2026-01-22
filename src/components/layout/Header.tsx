"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, User, MessageCircle, Search, ArrowRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "出店先を探す", href: "/search?type=space" },
  { name: "出店者を探す", href: "/search?type=vendor" },
  { name: "ご利用ガイド", href: "/guide" },
];

export function Header() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // セッションの状態からログイン状態を判定
  const isLoggedIn = status === "authenticated" && !!session;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <Logo size={72} />
          <div className="flex flex-col">
            <span className="text-3xl font-bold tracking-wide text-[#d35f2d]">てんむすび</span>
            <span className="text-xs text-[#8b7355] tracking-wider">出店者 × スペース マッチング</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-600 hover:text-gray-900" asChild>
                <Link href="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-600 hover:text-gray-900" asChild>
                <Link href="/messages">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session?.user?.image || ""} alt="ユーザー" />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {session?.user?.name?.[0] || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/mypage" className="cursor-pointer">
                      マイページ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit" className="cursor-pointer">
                      プロフィール編集
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages" className="cursor-pointer">
                      メッセージ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-gray-500"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
              <Button className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-6" asChild>
                <Link href="/register">
                  無料会員登録
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-white">
            <div className="flex flex-col gap-6 pt-6">
              <Link href="/" className="flex items-center gap-4" onClick={() => setOpen(false)}>
                <Logo size={72} />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold tracking-wide text-[#d35f2d]">てんむすび</span>
                  <span className="text-xs text-[#8b7355] tracking-wider">出店者 × スペース マッチング</span>
                </div>
              </Link>

              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-600 transition-colors hover:text-gray-900"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/mypage"
                      className="text-lg font-medium text-gray-900"
                      onClick={() => setOpen(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/messages"
                      className="text-lg font-medium text-gray-900"
                      onClick={() => setOpen(false)}
                    >
                      メッセージ
                    </Link>
                    <Button
                      variant="outline"
                      className="rounded-full mt-2 border-gray-200"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="rounded-full border-gray-200" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        ログイン
                      </Link>
                    </Button>
                    <Button className="rounded-full bg-gray-900 hover:bg-gray-800" asChild>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        無料会員登録
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
