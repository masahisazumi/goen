import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: ユーザーのポイント情報を取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalPoints: true },
    });

    return NextResponse.json({ totalPoints: user?.totalPoints || 0 });
  } catch (error) {
    console.error("Points fetch error:", error);
    return NextResponse.json({ error: "ポイント情報の取得に失敗しました" }, { status: 500 });
  }
}
