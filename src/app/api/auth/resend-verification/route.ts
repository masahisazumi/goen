import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEmailVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, emailVerified: true },
    });

    if (!user?.email) {
      return NextResponse.json(
        { error: "メールアドレスが見つかりません" },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "メールアドレスは既に確認済みです" },
        { status: 400 }
      );
    }

    // レート制限: 既存トークンの作成時刻を確認（60秒以内の再送を拒否）
    const existingToken = await prisma.verificationToken.findFirst({
      where: { identifier: `email-verify:${user.email}` },
    });

    if (existingToken) {
      const tokenAge = Date.now() - (existingToken.expires.getTime() - 24 * 60 * 60 * 1000);
      if (tokenAge < 60 * 1000) {
        return NextResponse.json(
          { error: "しばらく待ってから再送してください" },
          { status: 429 }
        );
      }
    }

    const token = await createEmailVerificationToken(user.email);
    await sendVerificationEmail(user.email, token);

    return NextResponse.json({ message: "確認メールを再送しました" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "メール送信中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
