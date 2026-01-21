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

// GET: 現在のユーザーのプロフィールを取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { images: true },
    });

    const userTypes = parseUserTypes(user?.userType || null);

    if (!profile) {
      // プロフィールがなくてもuserTypesは返す
      return NextResponse.json({ userTypes });
    }

    return NextResponse.json({ ...profile, userTypes });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "プロフィールの取得に失敗しました" }, { status: 500 });
  }
}

// PUT: プロフィールを更新
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { displayName, description, category, area, tags, website, instagram, twitter } = body;

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        displayName,
        description,
        category,
        area,
        tags: tags ? JSON.stringify(tags) : null,
        website,
        instagram,
        twitter,
      },
      create: {
        userId: session.user.id,
        displayName: displayName || session.user.name || "名前未設定",
        description,
        category,
        area,
        tags: tags ? JSON.stringify(tags) : null,
        website,
        instagram,
        twitter,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "プロフィールの更新に失敗しました" }, { status: 500 });
  }
}
