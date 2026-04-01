import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: ストアお気に入り一覧を取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const favorites = await prisma.storeFavorite.findMany({
      where: { userId: session.user.id },
      include: {
        store: {
          include: {
            images: { orderBy: { order: "asc" }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Store favorites fetch error:", error);
    return NextResponse.json({ error: "お気に入りの取得に失敗しました" }, { status: 500 });
  }
}

// POST: ストアをお気に入りに追加
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { storeId } = body;

    if (!storeId) {
      return NextResponse.json({ error: "ストアIDは必須です" }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ error: "ストアが見つかりません" }, { status: 404 });
    }

    const existingFavorite = await prisma.storeFavorite.findUnique({
      where: {
        userId_storeId: {
          userId: session.user.id,
          storeId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "既にお気に入りに追加されています" },
        { status: 400 }
      );
    }

    const favorite = await prisma.storeFavorite.create({
      data: {
        userId: session.user.id,
        storeId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Store favorite create error:", error);
    return NextResponse.json({ error: "お気に入りの追加に失敗しました" }, { status: 500 });
  }
}

// DELETE: ストアをお気に入りから削除
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json({ error: "ストアIDは必須です" }, { status: 400 });
    }

    const favorite = await prisma.storeFavorite.findUnique({
      where: {
        userId_storeId: {
          userId: session.user.id,
          storeId,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "お気に入りに登録されていません" },
        { status: 404 }
      );
    }

    await prisma.storeFavorite.delete({
      where: { id: favorite.id },
    });

    return NextResponse.json({ message: "お気に入りから削除しました" });
  } catch (error) {
    console.error("Store favorite delete error:", error);
    return NextResponse.json({ error: "お気に入りの削除に失敗しました" }, { status: 500 });
  }
}
