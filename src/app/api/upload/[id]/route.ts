import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { unlink } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

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
    const type = searchParams.get("type"); // "profile" or "space"

    if (type === "profile") {
      // Find the profile image
      const profileImage = await prisma.profileImage.findUnique({
        where: { id },
        include: { profile: true },
      });

      if (!profileImage) {
        return NextResponse.json({ error: "画像が見つかりません" }, { status: 404 });
      }

      // Verify ownership
      if (profileImage.profile.userId !== session.user.id) {
        return NextResponse.json(
          { error: "この画像を削除する権限がありません" },
          { status: 403 }
        );
      }

      // Delete file from filesystem
      if (profileImage.url.startsWith("/uploads/")) {
        const filename = profileImage.url.replace("/uploads/", "");
        const filepath = join(process.cwd(), "public", "uploads", filename);
        try {
          await unlink(filepath);
        } catch {
          // File might not exist
        }
      }

      // Delete from database
      await prisma.profileImage.delete({ where: { id } });
    } else if (type === "space") {
      // Find the space image
      const spaceImage = await prisma.spaceImage.findUnique({
        where: { id },
        include: { space: true },
      });

      if (!spaceImage) {
        return NextResponse.json({ error: "画像が見つかりません" }, { status: 404 });
      }

      // Verify ownership
      if (spaceImage.space.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: "この画像を削除する権限がありません" },
          { status: 403 }
        );
      }

      // Delete file from filesystem
      if (spaceImage.url.startsWith("/uploads/")) {
        const filename = spaceImage.url.replace("/uploads/", "");
        const filepath = join(process.cwd(), "public", "uploads", filename);
        try {
          await unlink(filepath);
        } catch {
          // File might not exist
        }
      }

      // Delete from database
      await prisma.spaceImage.delete({ where: { id } });
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
