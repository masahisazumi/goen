import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 連携済みアカウント一覧を取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
      },
    });

    // プロバイダー名を日本語に変換
    const formattedAccounts = accounts.map((account) => ({
      id: account.id,
      provider: account.provider,
      providerName: getProviderName(account.provider),
      isLinked: true,
    }));

    return NextResponse.json(formattedAccounts);
  } catch (error) {
    console.error("Get accounts error:", error);
    return NextResponse.json(
      { error: "アカウント情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE: アカウント連携を解除
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        { error: "accountIdは必須です" },
        { status: 400 }
      );
    }

    // ユーザーの全アカウント数を確認
    const accountCount = await prisma.account.count({
      where: { userId: session.user.id },
    });

    // パスワードが設定されているか確認
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    // 最後のアカウントかつパスワードが未設定の場合は解除不可
    if (accountCount <= 1 && !user?.password) {
      return NextResponse.json(
        { error: "最後のログイン方法は解除できません。先にパスワードを設定してください。" },
        { status: 400 }
      );
    }

    // アカウントが本人のものか確認
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "アカウントが見つかりません" },
        { status: 404 }
      );
    }

    // アカウント連携を解除
    await prisma.account.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ message: "アカウント連携を解除しました" });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "アカウント連携の解除に失敗しました" },
      { status: 500 }
    );
  }
}

function getProviderName(provider: string): string {
  const names: Record<string, string> = {
    google: "Google",
    line: "LINE",
    credentials: "メール/パスワード",
  };
  return names[provider] || provider;
}
