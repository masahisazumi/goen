import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, userType } = body;

    // Validation
    if (!email || !password || !name || !userType) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "パスワードは8文字以上で入力してください" },
        { status: 400 }
      );
    }

    if (!["vendor", "owner"].includes(userType)) {
      return NextResponse.json(
        { error: "無効なユーザータイプです" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with userType as JSON array
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        userType: JSON.stringify([userType]), // Store as JSON array
      },
    });

    // Create empty profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: name,
      },
    });

    return NextResponse.json(
      {
        message: "登録が完了しました",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userTypes: [userType], // Return as array
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "登録中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
