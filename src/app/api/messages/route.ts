import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 会話一覧を取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // Get all conversations (grouped by the other user)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group messages by conversation partner
    const conversationsMap = new Map<string, {
      partnerId: string;
      partnerName: string | null;
      partnerImage: string | null;
      lastMessage: string;
      lastMessageAt: Date;
      unreadCount: number;
    }>();

    for (const message of messages) {
      const partnerId = message.senderId === session.user.id
        ? message.receiverId
        : message.senderId;
      const partner = message.senderId === session.user.id
        ? message.receiver
        : message.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partnerName: partner.name,
          partnerImage: partner.image,
          lastMessage: message.content,
          lastMessageAt: message.createdAt,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (message.receiverId === session.user.id && !message.isRead) {
        const conv = conversationsMap.get(partnerId)!;
        conv.unreadCount++;
      }
    }

    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Conversations fetch error:", error);
    return NextResponse.json({ error: "会話の取得に失敗しました" }, { status: 500 });
  }
}

// POST: メッセージを送信
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: "宛先とメッセージ内容は必須です" }, { status: 400 });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json({ error: "送信先のユーザーが見つかりません" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json({ error: "メッセージの送信に失敗しました" }, { status: 500 });
  }
}
