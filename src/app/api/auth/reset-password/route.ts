import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyPasswordResetToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "パスワードは8文字以上で入力してください" },
        { status: 400 }
      );
    }

    const email = await verifyPasswordResetToken(token);

    if (!email) {
      return NextResponse.json(
        { error: "無効または期限切れのトークンです" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "パスワードが更新されました" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "パスワードリセット中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
