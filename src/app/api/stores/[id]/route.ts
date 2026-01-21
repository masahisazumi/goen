import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 特定の店舗を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        images: { orderBy: { order: "asc" } },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("Store fetch error:", error);
    return NextResponse.json({ error: "店舗の取得に失敗しました" }, { status: 500 });
  }
}

// PUT: 店舗を更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existingStore = await prisma.store.findUnique({
      where: { id },
    });

    if (!existingStore) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    if (existingStore.ownerId !== session.user.id) {
      return NextResponse.json({ error: "この店舗を編集する権限がありません" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, area, tags, website, instagram, twitter, isActive } = body;

    const store = await prisma.store.update({
      where: { id },
      data: {
        name,
        description,
        category,
        area,
        tags: tags ? JSON.stringify(tags) : undefined,
        website,
        instagram,
        twitter,
        isActive,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("Store update error:", error);
    return NextResponse.json({ error: "店舗の更新に失敗しました" }, { status: 500 });
  }
}

// DELETE: 店舗を削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existingStore = await prisma.store.findUnique({
      where: { id },
    });

    if (!existingStore) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    if (existingStore.ownerId !== session.user.id) {
      return NextResponse.json({ error: "この店舗を削除する権限がありません" }, { status: 403 });
    }

    await prisma.store.delete({ where: { id } });

    return NextResponse.json({ message: "店舗を削除しました" });
  } catch (error) {
    console.error("Store delete error:", error);
    return NextResponse.json({ error: "店舗の削除に失敗しました" }, { status: 500 });
  }
}
