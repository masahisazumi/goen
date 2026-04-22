import { NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 特定の店舗を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isDraftPreview = searchParams.get("draft") === "true";

    const session = await auth();
    const userId = session?.user?.id;

    // 下書きプレビュー時は全画像、通常は公開画像のみ
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        images: {
          where: isDraftPreview ? {} : { isDraft: false },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    const isOwner = userId === store.ownerId;
    const adminUser = userId ? await isAdmin(userId) : false;

    // 非公開の店舗はオーナーと管理者のみ閲覧可能
    if (!store.isActive && !isOwner && !adminUser) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    // 下書きプレビュー: オーナーのみ、draftDataがあればマージして返す
    if (isDraftPreview && (isOwner || adminUser) && store.draftData) {
      const draft = JSON.parse(store.draftData);
      return NextResponse.json({ ...store, ...draft, _isDraft: true });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("Store fetch error:", error);
    return NextResponse.json({ error: "店舗の取得に失敗しました" }, { status: 500 });
  }
}

// PUT: 店舗を更新（下書き保存 or 公開保存）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;

    const existingStore = await prisma.store.findUnique({
      where: { id },
    });

    if (!existingStore) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    const admin = await isAdmin(session.user.id);
    if (existingStore.ownerId !== session.user.id && !admin) {
      return NextResponse.json({ error: "この店舗を編集する権限がありません" }, { status: 403 });
    }

    const body = await request.json();
    const { saveMode, ...fields } = body;
    const {
      name, description, category, area, tags, website, instagram, twitter, isActive,
      ownerIntro, recommendedItems, commitment, calendarImageUrl, availableAreas,
      newsText, newsImageUrl, messageToOwners, motto,
      vehicleLength, vehicleWidth, vehicleHeight,
    } = fields;

    const toInt = (v: unknown): number | null | undefined => {
      if (v === undefined) return undefined;
      if (v === null || v === "") return null;
      const n = typeof v === "number" ? v : parseInt(String(v), 10);
      return Number.isFinite(n) && n >= 0 ? n : null;
    };

    // 下書き保存: draftDataにJSONとして保存、公開データは変更しない
    if (saveMode === "draft") {
      const draftData: Record<string, unknown> = {
        name, description, category, area,
        tags: tags ? JSON.stringify(tags) : existingStore.tags,
        website, instagram, twitter,
        ownerIntro, recommendedItems, commitment, calendarImageUrl,
        availableAreas: availableAreas ? JSON.stringify(availableAreas) : existingStore.availableAreas,
        newsText, newsImageUrl, messageToOwners, motto,
      };

      // 車両サイズは空文字列だと既存値を上書きしてしまうため、値がある時のみ保存
      if (vehicleLength !== undefined && vehicleLength !== null && vehicleLength !== "") {
        draftData.vehicleLength = vehicleLength;
      }
      if (vehicleWidth !== undefined && vehicleWidth !== null && vehicleWidth !== "") {
        draftData.vehicleWidth = vehicleWidth;
      }
      if (vehicleHeight !== undefined && vehicleHeight !== null && vehicleHeight !== "") {
        draftData.vehicleHeight = vehicleHeight;
      }

      const store = await prisma.store.update({
        where: { id },
        data: { draftData: JSON.stringify(draftData) },
      });

      return NextResponse.json(store);
    }

    // 公開保存: 下書き画像を公開に昇格
    await prisma.storeImage.updateMany({
      where: { storeId: id, isDraft: true },
      data: { isDraft: false },
    });

    // 公開保存: 本体を更新し、下書きをクリア
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
        ownerIntro,
        recommendedItems,
        commitment,
        calendarImageUrl,
        availableAreas: availableAreas ? JSON.stringify(availableAreas) : undefined,
        newsText,
        newsImageUrl,
        messageToOwners,
        motto,
        vehicleLength: toInt(vehicleLength),
        vehicleWidth: toInt(vehicleWidth),
        vehicleHeight: toInt(vehicleHeight),
        draftData: null, // 下書きをクリア
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("Store update error:", error);
    return NextResponse.json({ error: "店舗の更新に失敗しました" }, { status: 500 });
  }
}

// DELETE: 店舗を削除
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;

    const existingStore = await prisma.store.findUnique({
      where: { id },
    });

    if (!existingStore) {
      return NextResponse.json({ error: "店舗が見つかりません" }, { status: 404 });
    }

    const adminDel = await isAdmin(session.user.id);
    if (existingStore.ownerId !== session.user.id && !adminDel) {
      return NextResponse.json({ error: "この店舗を削除する権限がありません" }, { status: 403 });
    }

    await prisma.store.delete({ where: { id } });

    return NextResponse.json({ message: "店舗を削除しました" });
  } catch (error) {
    console.error("Store delete error:", error);
    return NextResponse.json({ error: "店舗の削除に失敗しました" }, { status: 500 });
  }
}
