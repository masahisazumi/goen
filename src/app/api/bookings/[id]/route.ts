import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: 特定の予約を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
    }

    // Get space info
    const space = await prisma.space.findUnique({
      where: { id: booking.spaceId },
      select: { id: true, name: true, location: true, ownerId: true },
    });

    // Check if user has permission to view this booking
    const isVendor = booking.vendorId === session.user.id;
    const isOwner = space?.ownerId === session.user.id;

    if (!isVendor && !isOwner) {
      return NextResponse.json({ error: "この予約を閲覧する権限がありません" }, { status: 403 });
    }

    const vendor = await prisma.user.findUnique({
      where: { id: booking.vendorId },
      select: { id: true, name: true, image: true },
    });

    return NextResponse.json({ ...booking, space, vendor });
  } catch (error) {
    console.error("Booking fetch error:", error);
    return NextResponse.json({ error: "予約の取得に失敗しました" }, { status: 500 });
  }
}

// PUT: 予約ステータスを更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "無効なステータスです" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
    }

    // Get space to check ownership
    const space = await prisma.space.findUnique({
      where: { id: booking.spaceId },
      select: { ownerId: true },
    });

    const isVendor = booking.vendorId === session.user.id;
    const isOwner = space?.ownerId === session.user.id;

    // Vendors can only cancel their own bookings
    // Owners can confirm, cancel, or complete bookings
    if (isVendor && status !== "cancelled") {
      return NextResponse.json(
        { error: "出店者は予約のキャンセルのみ可能です" },
        { status: 403 }
      );
    }

    if (!isVendor && !isOwner) {
      return NextResponse.json(
        { error: "この予約を更新する権限がありません" },
        { status: 403 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "予約の更新に失敗しました" }, { status: 500 });
  }
}

// DELETE: 予約を削除
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

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
    }

    // Only vendor can delete their pending booking
    if (booking.vendorId !== session.user.id) {
      return NextResponse.json(
        { error: "この予約を削除する権限がありません" },
        { status: 403 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "確定済みまたはキャンセル済みの予約は削除できません" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({ message: "予約を削除しました" });
  } catch (error) {
    console.error("Booking delete error:", error);
    return NextResponse.json({ error: "予約の削除に失敗しました" }, { status: 500 });
  }
}
