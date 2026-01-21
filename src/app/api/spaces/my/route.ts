import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 自分が所有するスペース一覧を取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const spaces = await prisma.space.findMany({
      where: { ownerId: session.user.id },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        _count: { select: { reviews: true, favorites: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(spaces);
  } catch (error) {
    console.error("My spaces fetch error:", error);
    return NextResponse.json({ error: "スペースの取得に失敗しました" }, { status: 500 });
  }
}
