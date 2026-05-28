import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "댓글을 입력해주세요").max(500, "500자 이내로 작성해주세요"),
});

// GET /api/products/[id]/comments — 공개
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;

  const comments = await prisma.productComment.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, phone: true } },
    },
  });

  return NextResponse.json(comments);
}

// POST /api/products/[id]/comments — 로그인 필수
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { id: productId } = await params;

  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다" }, { status: 404 });
  }

  const comment = await prisma.productComment.create({
    data: { productId, userId: session.user.id, content: parsed.data.content },
    include: {
      user: { select: { id: true, name: true, phone: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
