import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 出店者一覧を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const area = searchParams.get("area");
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Find profiles with user type "vendor"
    const profileWhere: Record<string, unknown> = {};

    if (category) {
      profileWhere.category = category;
    }

    if (area) {
      profileWhere.area = { contains: area };
    }

    if (query) {
      profileWhere.OR = [
        { displayName: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where: {
          ...profileWhere,
          user: { userType: "vendor" },
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
          images: { orderBy: { order: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.profile.count({
        where: {
          ...profileWhere,
          user: { userType: "vendor" },
        },
      }),
    ]);

    // Add review stats
    const vendorsWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const reviewStats = await prisma.review.aggregate({
          where: { targetId: profile.userId },
          _avg: { rating: true },
          _count: { rating: true },
        });
        return {
          ...profile,
          averageRating: reviewStats._avg.rating || 0,
          reviewCount: reviewStats._count.rating,
        };
      })
    );

    return NextResponse.json({ vendors: vendorsWithStats, total, limit, offset });
  } catch (error) {
    console.error("Vendors fetch error:", error);
    return NextResponse.json({ error: "出店者の取得に失敗しました" }, { status: 500 });
  }
}
