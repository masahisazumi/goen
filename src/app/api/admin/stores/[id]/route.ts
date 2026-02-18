import { NextResponse } from "next/server";
import { auth, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT: 管理者が店舗更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const adminCheck = await requireAdmin(session.user.id);
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;

    const existingStore = await prisma.store.findUnique({ where: { id } });
    if (!existingStore) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
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
    console.error("Admin store update error:", error);
    return NextResponse.json({ error: "店舗の更新に失敗しました" }, { status: 500 });
  }
}

// DELETE: 管理者が店舗削除
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const adminCheck = await requireAdmin(session.user.id);
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;

    const existingStore = await prisma.store.findUnique({ where: { id } });
    if (!existingStore) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    await prisma.store.delete({ where: { id } });

    return NextResponse.json({ message: "店舗を削除しました" });
  } catch (error) {
    console.error("Admin store delete error:", error);
    return NextResponse.json({ error: "店舗の削除に失敗しました" }, { status: 500 });
  }
}
