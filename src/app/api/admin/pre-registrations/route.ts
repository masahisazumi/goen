import { NextResponse } from "next/server";
import { auth, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 先行登録一覧を取得（管理者用）
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 管理者チェック
    const adminCheck = await requireAdmin(session.user.id);
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get("userType");

    const where = userType ? { userType } : {};

    const registrations = await prisma.preRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // 統計情報
    const stats = {
      total: registrations.length,
      vendors: registrations.filter((r) => r.userType === "vendor").length,
      owners: registrations.filter((r) => r.userType === "owner").length,
    };

    return NextResponse.json({ registrations, stats });
  } catch (error) {
    console.error("Admin pre-registrations list error:", error);
    return NextResponse.json(
      { error: "先行登録一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE: 先行登録を削除（管理者用）
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 管理者チェック
    const adminCheck = await requireAdmin(session.user.id);
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
    }

    await prisma.preRegistration.delete({
      where: { id },
    });

    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    console.error("Admin pre-registration delete error:", error);
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 }
    );
  }
}
