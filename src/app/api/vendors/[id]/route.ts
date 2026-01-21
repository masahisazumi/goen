import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 特定の出店者を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find user with profile
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        userType: true,
        profile: {
          include: {
            images: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!user || user.userType !== "vendor") {
      return NextResponse.json({ error: "出店者が見つかりません" }, { status: 404 });
    }

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: { targetId: id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        space: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Calculate stats
    const reviewStats = await prisma.review.aggregate({
      where: { targetId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return NextResponse.json({
      ...user,
      reviews,
      averageRating: reviewStats._avg.rating || 0,
      reviewCount: reviewStats._count.rating,
    });
  } catch (error) {
    console.error("Vendor fetch error:", error);
    return NextResponse.json({ error: "出店者の取得に失敗しました" }, { status: 500 });
  }
}
