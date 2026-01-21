import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 特定のスペースを取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        reviews: {
          include: { author: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true, favorites: true } },
      },
    });

    if (!space) {
      return NextResponse.json({ error: "スペースが見つかりません" }, { status: 404 });
    }

    return NextResponse.json(space);
  } catch (error) {
    console.error("Space fetch error:", error);
    return NextResponse.json({ error: "スペースの取得に失敗しました" }, { status: 500 });
  }
}

// PUT: スペースを更新
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
    const existingSpace = await prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      return NextResponse.json({ error: "スペースが見つかりません" }, { status: 404 });
    }

    if (existingSpace.ownerId !== session.user.id) {
      return NextResponse.json({ error: "このスペースを編集する権限がありません" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, location, address, capacity, price, tags, facilities, openingHours, closedDays, isActive } = body;

    const space = await prisma.space.update({
      where: { id },
      data: {
        name,
        description,
        location,
        address,
        capacity,
        price,
        tags: tags ? JSON.stringify(tags) : undefined,
        facilities: facilities ? JSON.stringify(facilities) : undefined,
        openingHours,
        closedDays,
        isActive,
      },
    });

    return NextResponse.json(space);
  } catch (error) {
    console.error("Space update error:", error);
    return NextResponse.json({ error: "スペースの更新に失敗しました" }, { status: 500 });
  }
}

// DELETE: スペースを削除
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
    const existingSpace = await prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      return NextResponse.json({ error: "スペースが見つかりません" }, { status: 404 });
    }

    if (existingSpace.ownerId !== session.user.id) {
      return NextResponse.json({ error: "このスペースを削除する権限がありません" }, { status: 403 });
    }

    await prisma.space.delete({ where: { id } });

    return NextResponse.json({ message: "スペースを削除しました" });
  } catch (error) {
    console.error("Space delete error:", error);
    return NextResponse.json({ error: "スペースの削除に失敗しました" }, { status: 500 });
  }
}
