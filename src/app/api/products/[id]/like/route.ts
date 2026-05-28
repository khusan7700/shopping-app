import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/products/[id]/like — 좋아요 수 + 내 좋아요 여부
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const session = await auth();

  const [likeCount, myLike] = await Promise.all([
    prisma.productLike.count({ where: { productId } }),
    session?.user?.id
      ? prisma.productLike.findUnique({
          where: { productId_userId: { productId, userId: session.user.id } },
          select: { id: true },
        })
      : null,
  ]);

  return NextResponse.json({
    likeCount,
    liked: !!myLike,
    likeId: myLike?.id ?? null,
  });
}

// POST /api/products/[id]/like — 좋아요 토글 (추가/취소)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { id: productId } = await params;
  const userId = session.user.id;

  const existing = await prisma.productLike.findUnique({
    where: { productId_userId: { productId, userId } },
  });

  let liked: boolean;
  let likeId: string | null;

  if (existing) {
    // 이미 좋아요 → 취소
    await prisma.productLike.delete({ where: { id: existing.id } });
    liked = false;
    likeId = null;
  } else {
    // 좋아요 추가
    const created = await prisma.productLike.create({
      data: { productId, userId },
    });
    liked = true;
    likeId = created.id;
  }

  const likeCount = await prisma.productLike.count({ where: { productId } });
  return NextResponse.json({ liked, likeId, likeCount });
}
