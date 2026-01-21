import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: 新しいアカウントをリンク（OAuth認証後に呼び出される）
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { provider, providerAccountId, accessToken, refreshToken, expiresAt } = body;

    if (!provider || !providerAccountId) {
      return NextResponse.json(
        { error: "provider と providerAccountId は必須です" },
        { status: 400 }
      );
    }

    // 既に同じプロバイダーが連携されていないか確認
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: provider,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: `${provider}は既に連携されています` },
        { status: 400 }
      );
    }

    // 同じプロバイダーアカウントが他のユーザーに紐付いていないか確認
    const accountUsedByOther = await prisma.account.findFirst({
      where: {
        provider: provider,
        providerAccountId: providerAccountId,
      },
    });

    if (accountUsedByOther) {
      return NextResponse.json(
        { error: "このアカウントは既に別のユーザーに連携されています" },
        { status: 400 }
      );
    }

    // 新しいアカウントを作成
    const account = await prisma.account.create({
      data: {
        userId: session.user.id,
        type: "oauth",
        provider: provider,
        providerAccountId: providerAccountId,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      },
    });

    return NextResponse.json({
      message: "アカウントを連携しました",
      account: {
        id: account.id,
        provider: account.provider,
      },
    });
  } catch (error) {
    console.error("Link account error:", error);
    return NextResponse.json(
      { error: "アカウント連携に失敗しました" },
      { status: 500 }
    );
  }
}
