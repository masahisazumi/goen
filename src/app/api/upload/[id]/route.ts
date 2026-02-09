import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";

// DELETE: 画像を削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "profile", "space", or "store"

    if (type === "profile") {
      const profileImage = await prisma.profileImage.findUnique({
        where: { id },
        include: { profile: true },
      });

      if (!profileImage) {
        return NextResponse.json({ error: "画像が見つかりません" }, { status: 404 });
      }

      if (profileImage.profile.userId !== session.user.id) {
        return NextResponse.json(
          { error: "この画像を削除する権限がありません" },
          { status: 403 }
        );
      }

      await deleteFile(profileImage.url);
      await prisma.profileImage.delete({ where: { id } });
    } else if (type === "space") {
      const spaceImage = await prisma.spaceImage.findUnique({
        where: { id },
        include: { space: true },
      });

      if (!spaceImage) {
        return NextResponse.json({ error: "画像が見つかりません" }, { status: 404 });
      }

      if (spaceImage.space.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: "この画像を削除する権限がありません" },
          { status: 403 }
        );
      }

      await deleteFile(spaceImage.url);
      await prisma.spaceImage.delete({ where: { id } });
    } else if (type === "store") {
      const storeImage = await prisma.storeImage.findUnique({
        where: { id },
        include: { store: true },
      });

      if (!storeImage) {
        return NextResponse.json({ error: "画像が見つかりません" }, { status: 404 });
      }

      if (storeImage.store.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: "この画像を削除する権限がありません" },
          { status: 403 }
        );
      }

      await deleteFile(storeImage.url);
      await prisma.storeImage.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "typeパラメータが必要です" }, { status: 400 });
    }

    return NextResponse.json({ message: "画像を削除しました" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "画像の削除に失敗しました" },
      { status: 500 }
    );
  }
}
