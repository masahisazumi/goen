import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 特定ユーザーとの会話を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { partnerId } = await params;
    const { searchParams } = new URL(request.url);
    const after = searchParams.get("after");

    // Get partner info
    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
      select: { id: true, name: true, image: true },
    });

    if (!partner) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // Build where clause
    const whereClause: Record<string, unknown> = {
      OR: [
        { senderId: session.user.id, receiverId: partnerId },
        { senderId: partnerId, receiverId: session.user.id },
      ],
    };

    // ポーリング用: 指定IDより後のメッセージのみ取得
    if (after) {
      const afterMessage = await prisma.message.findUnique({
        where: { id: after },
        select: { createdAt: true },
      });
      if (afterMessage) {
        whereClause.createdAt = { gt: afterMessage.createdAt };
      }
    }

    // Get messages between the two users
    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ partner, messages });
  } catch (error) {
    console.error("Conversation fetch error:", error);
    return NextResponse.json({ error: "会話の取得に失敗しました" }, { status: 500 });
  }
}
