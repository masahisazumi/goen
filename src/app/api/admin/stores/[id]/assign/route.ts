import { NextResponse } from "next/server";
import { auth, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT: オーナー紐付け
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
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDは必須です" }, { status: 400 });
    }

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    const updated = await prisma.store.update({
      where: { id },
      data: { ownerId: userId },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin store assign error:", error);
    return NextResponse.json({ error: "オーナーの紐付けに失敗しました" }, { status: 500 });
  }
}

// DELETE: オーナー紐付け解除
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

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    const updated = await prisma.store.update({
      where: { id },
      data: { ownerId: null },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin store unassign error:", error);
    return NextResponse.json({ error: "オーナーの紐付け解除に失敗しました" }, { status: 500 });
  }
}
