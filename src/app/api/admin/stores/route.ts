import { NextResponse } from "next/server";
import { auth, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 全店舗一覧（管理者用）
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const adminCheck = await requireAdmin(session.user.id);
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const stores = await prisma.store.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = stores.length;
    const assigned = stores.filter((s) => s.ownerId !== null).length;
    const unassigned = total - assigned;

    return NextResponse.json({
      stores,
      stats: { total, assigned, unassigned },
    });
  } catch (error) {
    console.error("Admin stores fetch error:", error);
    return NextResponse.json({ error: "店舗一覧の取得に失敗しました" }, { status: 500 });
  }
}

// POST: 管理者が店舗作成（ownerId: null）
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const adminCheck = await requireAdmin(session.user.id);
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { name, description, category, area, website, instagram, twitter } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "店舗名は必須です" }, { status: 400 });
    }

    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        description: description || null,
        category: category || null,
        area: area || null,
        website: website || null,
        instagram: instagram || null,
        twitter: twitter || null,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("Admin store create error:", error);
    return NextResponse.json({ error: "店舗の作成に失敗しました" }, { status: 500 });
  }
}
