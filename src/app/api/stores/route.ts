import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 店舗一覧を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = { isActive: true };

    if (area) {
      where.area = { contains: area };
    }

    if (category) {
      where.category = { contains: category };
    }

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true, image: true } },
          images: { orderBy: { order: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.store.count({ where }),
    ]);

    return NextResponse.json({ stores, total, limit, offset });
  } catch (error) {
    console.error("Stores fetch error:", error);
    return NextResponse.json({ error: "店舗の取得に失敗しました" }, { status: 500 });
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

// POST: 新規店舗を作成
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 出店者（vendor）かどうかをチェック
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });
    const userTypes = parseUserTypes(user?.userType || null);
    if (!userTypes.includes("vendor")) {
      return NextResponse.json({ error: "店舗登録は出店者のみ利用できます" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, area, tags, website, instagram, twitter } = body;

    if (!name) {
      return NextResponse.json({ error: "店舗名は必須です" }, { status: 400 });
    }

    const store = await prisma.store.create({
      data: {
        ownerId: session.user.id,
        name,
        description,
        category,
        area,
        tags: tags ? JSON.stringify(tags) : null,
        website,
        instagram,
        twitter,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("Store create error:", error);
    return NextResponse.json({ error: "店舗の作成に失敗しました" }, { status: 500 });
  }
}
