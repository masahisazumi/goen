import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { POINTS, CHECKIN_COOLDOWN_HOURS } from "@/lib/constants";

// POST: チェックイン
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { storeId, token } = await request.json();

    if (!storeId || !token) {
      return NextResponse.json({ error: "パラメータが不足しています" }, { status: 400 });
    }

    // トークン検証
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, name: true, qrToken: true },
    });

    if (!store || store.qrToken !== token) {
      return NextResponse.json({ error: "無効なQRコードです" }, { status: 400 });
    }

    // クールダウンチェック
    const cooldownTime = new Date(Date.now() - CHECKIN_COOLDOWN_HOURS * 60 * 60 * 1000);
    const recentCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: session.user.id,
        storeId,
        createdAt: { gte: cooldownTime },
      },
    });

    if (recentCheckIn) {
      return NextResponse.json(
        { error: `同じ店舗へのチェックインは${CHECKIN_COOLDOWN_HOURS}時間に1回までです` },
        { status: 429 }
      );
    }

    // チェックイン + ポイント付与をトランザクションで実行
    const [checkIn] = await prisma.$transaction([
      prisma.checkIn.create({
        data: {
          userId: session.user.id,
          storeId,
        },
      }),
      prisma.pointTransaction.create({
        data: {
          userId: session.user.id,
          points: POINTS.CHECKIN,
          type: "checkin",
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalPoints: { increment: POINTS.CHECKIN },
        },
      }),
    ]);

    // refIdを更新
    await prisma.pointTransaction.updateMany({
      where: {
        userId: session.user.id,
        type: "checkin",
        refId: null,
      },
      data: { refId: checkIn.id },
    });

    return NextResponse.json({
      success: true,
      checkIn,
      points: POINTS.CHECKIN,
      storeName: store.name,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "チェックインに失敗しました" }, { status: 500 });
  }
}

// GET: チェックイン履歴
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [checkIns, total] = await Promise.all([
      prisma.checkIn.findMany({
        where: { userId: session.user.id },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              area: true,
              category: true,
              images: { orderBy: { order: "asc" }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.checkIn.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({ checkIns, total });
  } catch (error) {
    console.error("Check-in history error:", error);
    return NextResponse.json({ error: "チェックイン履歴の取得に失敗しました" }, { status: 500 });
  }
}
