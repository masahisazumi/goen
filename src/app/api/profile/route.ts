import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 現在のユーザーのプロフィールを取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { images: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "プロフィールが見つかりません" }, { status: 404 });
    }

    return NextResponse.json(profile);
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
