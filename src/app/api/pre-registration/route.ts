import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userType } = body;

    // Validate required fields
    if (!email || !userType) {
      return NextResponse.json(
        { error: "メールアドレスと利用目的は必須です" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // Validate userType
    if (!["vendor", "owner"].includes(userType)) {
      return NextResponse.json(
        { error: "利用目的が不正です" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.preRegistration.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 409 }
      );
    }

    // Create pre-registration
    const registration = await prisma.preRegistration.create({
      data: {
        email,
        userType,
      },
    });

    return NextResponse.json(
      { message: "先行登録が完了しました", id: registration.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pre-registration error:", error);
    return NextResponse.json(
      { error: "登録に失敗しました。しばらく経ってからお試しください" },
      { status: 500 }
    );
  }
}
