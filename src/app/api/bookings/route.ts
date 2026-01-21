import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 予約一覧を取得
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role"); // "vendor" or "owner"

    // Get user type
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });

    let where: Record<string, unknown> = {};

    // If user is a vendor, show their bookings
    // If user is an owner, show bookings for their spaces
    if (role === "vendor" || user?.userType === "vendor") {
      where.vendorId = session.user.id;
    } else {
      // Get owner's spaces
      const spaces = await prisma.space.findMany({
        where: { ownerId: session.user.id },
        select: { id: true },
      });
      where.spaceId = { in: spaces.map(s => s.id) };
    }

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { date: "desc" },
    });

    // Enrich with space and vendor info
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const space = await prisma.space.findUnique({
          where: { id: booking.spaceId },
          select: { id: true, name: true, location: true },
        });
        const vendor = await prisma.user.findUnique({
          where: { id: booking.vendorId },
          select: { id: true, name: true, image: true },
        });
        return { ...booking, space, vendor };
      })
    );

    return NextResponse.json(enrichedBookings);
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json({ error: "予約の取得に失敗しました" }, { status: 500 });
  }
}

// POST: 新規予約を作成
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { spaceId, date, message } = body;

    if (!spaceId || !date) {
      return NextResponse.json({ error: "スペースと日付は必須です" }, { status: 400 });
    }

    // Check if space exists
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      return NextResponse.json({ error: "スペースが見つかりません" }, { status: 404 });
    }

    // Check for existing booking on the same date
    const existingBooking = await prisma.booking.findFirst({
      where: {
        spaceId,
        date: new Date(date),
        status: { in: ["pending", "confirmed"] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "この日付は既に予約が入っています" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        vendorId: session.user.id,
        spaceId,
        date: new Date(date),
        message,
        status: "pending",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking create error:", error);
    return NextResponse.json({ error: "予約の作成に失敗しました" }, { status: 500 });
  }
}
