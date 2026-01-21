import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: レビュー一覧を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("targetId");
    const spaceId = searchParams.get("spaceId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};

    if (targetId) {
      where.targetId = targetId;
    }

    if (spaceId) {
      where.spaceId = spaceId;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
          space: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.review.count({ where }),
    ]);

    // Calculate average rating
    const avgResult = await prisma.review.aggregate({
      where,
      _avg: { rating: true },
    });

    return NextResponse.json({
      reviews,
      total,
      averageRating: avgResult._avg.rating || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "レビューの取得に失敗しました" }, { status: 500 });
  }
}

// POST: 新規レビューを作成
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { targetId, spaceId, rating, content } = body;

    if (!targetId || !rating) {
      return NextResponse.json(
        { error: "評価対象と評価は必須です" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "評価は1〜5の範囲で入力してください" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "評価対象のユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // Prevent self-review
    if (targetId === session.user.id) {
      return NextResponse.json(
        { error: "自分自身を評価することはできません" },
        { status: 400 }
      );
    }

    // Check for existing review from this author for this target
    const existingReview = await prisma.review.findFirst({
      where: {
        authorId: session.user.id,
        targetId,
        spaceId: spaceId || null,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "既にレビューを投稿しています" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        authorId: session.user.id,
        targetId,
        spaceId: spaceId || null,
        rating,
        content,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json({ error: "レビューの作成に失敗しました" }, { status: 500 });
  }
}
