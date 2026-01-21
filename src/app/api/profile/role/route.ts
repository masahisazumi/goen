import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ユーザータイプをパースするヘルパー関数
function parseUserTypes(userType: string | null): string[] {
  if (!userType) return [];
  try {
    const parsed = JSON.parse(userType);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // 旧フォーマット（単一文字列）のサポート
    return userType ? [userType] : [];
  }
}

// POST: 役割を追加
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !["vendor", "owner"].includes(role)) {
      return NextResponse.json({ error: "無効な役割です" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });

    const currentRoles = parseUserTypes(user?.userType || null);

    // 既に持っている役割の場合
    if (currentRoles.includes(role)) {
      return NextResponse.json({
        message: "既にこの役割を持っています",
        userTypes: currentRoles
      });
    }

    // 新しい役割を追加
    const newRoles = [...currentRoles, role];

    await prisma.user.update({
      where: { id: session.user.id },
      data: { userType: JSON.stringify(newRoles) },
    });

    return NextResponse.json({
      message: "役割を追加しました",
      userTypes: newRoles
    });
  } catch (error) {
    console.error("Role add error:", error);
    return NextResponse.json({ error: "役割の追加に失敗しました" }, { status: 500 });
  }
}
