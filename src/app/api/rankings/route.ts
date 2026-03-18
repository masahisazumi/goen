import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: ランキング取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefecture = searchParams.get("prefecture");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { isActive: true };
    if (prefecture && prefecture !== "すべて") {
      where.area = { contains: prefecture };
    }

    const stores = await prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        area: true,
        category: true,
        images: { orderBy: { order: "asc" }, take: 1 },
        _count: { select: { checkIns: true } },
      },
      orderBy: {
        checkIns: { _count: "desc" },
      },
      take: limit,
    });

    // ランキング順位を付与
    const rankings = stores.map((store, index) => ({
      rank: index + 1,
      id: store.id,
      name: store.name,
      area: store.area,
      category: store.category,
      image: store.images[0]?.url || null,
      checkInCount: store._count.checkIns,
    }));

    return NextResponse.json({ rankings });
  } catch (error) {
    console.error("Rankings error:", error);
    return NextResponse.json({ error: "ランキングの取得に失敗しました" }, { status: 500 });
  }
}
