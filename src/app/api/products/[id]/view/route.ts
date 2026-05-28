import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createHash } from "crypto";

// POST /api/products/[id]/view — 조회수 기록
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const session = await auth();

  // IP hash (anonim foydalanuvchi uchun)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

  if (session?.user?.id) {
    // 로그인 유저: 같은 날 같은 상품 중복 조회 방지
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.productView.findFirst({
      where: {
        productId,
        userId: session.user.id,
        createdAt: { gte: today },
      },
    });

    if (!existing) {
      await prisma.productView.create({
        data: { productId, userId: session.user.id },
      });
    }
  } else {
    // 비로그인: IP hash 기준 오늘 중복 방지
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.productView.findFirst({
      where: {
        productId,
        ipHash,
        userId: null,
        createdAt: { gte: today },
      },
    });

    if (!existing) {
      await prisma.productView.create({
        data: { productId, ipHash, userId: null },
      });
    }
  }

  // 총 조회수 반환
  const viewCount = await prisma.productView.count({ where: { productId } });
  return NextResponse.json({ viewCount });
}

// GET /api/products/[id]/view — 조회수 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const viewCount = await prisma.productView.count({ where: { productId } });
  return NextResponse.json({ viewCount });
}
