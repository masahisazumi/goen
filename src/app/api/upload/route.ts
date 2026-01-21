import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "profile" or "space"
    const targetId = formData.get("targetId") as string | null; // spaceId if type is "space"

    if (!file) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "JPG, PNG, WebP, GIF形式の画像のみアップロード可能です" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `${session.user.id}_${timestamp}.${extension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;

    // Save to database based on type
    if (type === "profile") {
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      });

      if (profile) {
        await prisma.profileImage.create({
          data: {
            profileId: profile.id,
            url: imageUrl,
            order: 0,
          },
        });
      }
    } else if (type === "space" && targetId) {
      // Verify ownership
      const space = await prisma.space.findUnique({
        where: { id: targetId },
      });

      if (!space || space.ownerId !== session.user.id) {
        return NextResponse.json(
          { error: "このスペースに画像を追加する権限がありません" },
          { status: 403 }
        );
      }

      await prisma.spaceImage.create({
        data: {
          spaceId: targetId,
          url: imageUrl,
          order: 0,
        },
      });
    }

    return NextResponse.json({ url: imageUrl }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "アップロードに失敗しました" },
      { status: 500 }
    );
  }
}
