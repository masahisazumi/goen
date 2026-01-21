import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

// POST: アカウントリンクモードを開始
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { provider } = body;

    if (!provider || !["google", "line"].includes(provider)) {
      return NextResponse.json(
        { error: "有効なプロバイダーを指定してください" },
        { status: 400 }
      );
    }

    // ユーザーIDをクッキーに保存（アカウントリンクモードを示す）
    const cookieStore = await cookies();
    cookieStore.set("link_user_id", session.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5分間有効
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "アカウントリンクモードを開始しました",
    });
  } catch (error) {
    console.error("Start link error:", error);
    return NextResponse.json(
      { error: "アカウントリンクの開始に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE: アカウントリンクモードをキャンセル
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("link_user_id");

    return NextResponse.json({
      success: true,
      message: "アカウントリンクモードをキャンセルしました",
    });
  } catch (error) {
    console.error("Cancel link error:", error);
    return NextResponse.json(
      { error: "キャンセルに失敗しました" },
      { status: 500 }
    );
  }
}
