import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 認証申請のステータスを取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const [verificationRequest, profile] = await Promise.all([
      prisma.verificationRequest.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { isVerified: true },
      }),
    ]);

    return NextResponse.json({
      isVerified: profile?.isVerified || false,
      request: verificationRequest,
    });
  } catch (error) {
    console.error("Verification status error:", error);
    return NextResponse.json(
      { error: "認証ステータスの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: 認証申請を提出
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { documentType, documentUrl } = body;

    if (!documentType) {
      return NextResponse.json(
        { error: "書類の種類を選択してください" },
        { status: 400 }
      );
    }

    // Check for existing pending request
    const existingRequest = await prisma.verificationRequest.findUnique({
      where: { userId: session.user.id },
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return NextResponse.json(
          { error: "既に審査中の申請があります" },
          { status: 400 }
        );
      }

      // Update existing request (re-submission after rejection)
      const updatedRequest = await prisma.verificationRequest.update({
        where: { userId: session.user.id },
        data: {
          documentType,
          documentUrl,
          status: "pending",
          note: null,
          submittedAt: new Date(),
          reviewedAt: null,
          reviewedBy: null,
        },
      });

      return NextResponse.json(updatedRequest);
    }

    // Create new request
    const verificationRequest = await prisma.verificationRequest.create({
      data: {
        userId: session.user.id,
        documentType,
        documentUrl,
        status: "pending",
      },
    });

    return NextResponse.json(verificationRequest, { status: 201 });
  } catch (error) {
    console.error("Verification submit error:", error);
    return NextResponse.json(
      { error: "認証申請の提出に失敗しました" },
      { status: 500 }
    );
  }
}
