import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: お気に入り一覧を取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        space: {
          include: {
            images: { orderBy: { order: "asc" }, take: 1 },
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Favorites fetch error:", error);
    return NextResponse.json({ error: "お気に入りの取得に失敗しました" }, { status: 500 });
  }
}

// POST: お気に入りに追加
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { spaceId } = body;

    if (!spaceId) {
      return NextResponse.json({ error: "スペースIDは必須です" }, { status: 400 });
    }

    // Check if space exists
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      return NextResponse.json({ error: "スペースが見つかりません" }, { status: 404 });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_spaceId: {
          userId: session.user.id,
          spaceId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "既にお気に入りに追加されています" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        spaceId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Favorite create error:", error);
    return NextResponse.json({ error: "お気に入りの追加に失敗しました" }, { status: 500 });
  }
}

// DELETE: お気に入りから削除
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get("spaceId");

    if (!spaceId) {
      return NextResponse.json({ error: "スペースIDは必須です" }, { status: 400 });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_spaceId: {
          userId: session.user.id,
          spaceId,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "お気に入りに登録されていません" },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return NextResponse.json({ message: "お気に入りから削除しました" });
  } catch (error) {
    console.error("Favorite delete error:", error);
    return NextResponse.json({ error: "お気に入りの削除に失敗しました" }, { status: 500 });
  }
}
