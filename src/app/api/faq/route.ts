import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 公開FAQを取得
export async function GET() {
  try {
    const items = await prisma.faqItem.findMany({
      where: { isPublished: true },
      orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("FAQ fetch error:", error);
    return NextResponse.json({ error: "FAQの取得に失敗しました" }, { status: 500 });
  }
}
