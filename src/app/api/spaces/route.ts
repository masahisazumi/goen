import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: スペース一覧を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = { isActive: true };

    if (location) {
      where.location = { contains: location };
    }

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    const [spaces, total] = await Promise.all([
      prisma.space.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          _count: { select: { reviews: true, favorites: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.space.count({ where }),
    ]);

    return NextResponse.json({ spaces, total, limit, offset });
  } catch (error) {
    console.error("Spaces fetch error:", error);
    return NextResponse.json({ error: "スペースの取得に失敗しました" }, { status: 500 });
  }
}

// ユーザータイプをパースするヘルパー関数
function parseUserTypes(userType: string | null): string[] {
  if (!userType) return [];
  try {
    const parsed = JSON.parse(userType);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return userType ? [userType] : [];
  }
}

// POST: 新規スペースを作成
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // スペースオーナー（owner）かどうかをチェック
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });
    const userTypes = parseUserTypes(user?.userType || null);
    if (!userTypes.includes("owner")) {
      return NextResponse.json({ error: "スペース登録はスペースオーナーのみ利用できます" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, location, address, capacity, price, tags, facilities, openingHours, closedDays } = body;

    if (!name || !location) {
      return NextResponse.json({ error: "名前と場所は必須です" }, { status: 400 });
    }

    const space = await prisma.space.create({
      data: {
        ownerId: session.user.id,
        name,
        description,
        location,
        address,
        capacity,
        price,
        tags: tags ? JSON.stringify(tags) : null,
        facilities: facilities ? JSON.stringify(facilities) : null,
        openingHours,
        closedDays,
      },
    });

    return NextResponse.json(space, { status: 201 });
  } catch (error) {
    console.error("Space create error:", error);
    return NextResponse.json({ error: "スペースの作成に失敗しました" }, { status: 500 });
  }
}
