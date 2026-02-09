import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmailToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "トークンが必要です" },
        { status: 400 }
      );
    }

    const email = await verifyEmailToken(token);

    if (!email) {
      return NextResponse.json(
        { error: "無効または期限切れのトークンです" },
        { status: 400 }
      );
    }

    // emailVerifiedを更新
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({ message: "メールアドレスが確認されました" });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "確認処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
