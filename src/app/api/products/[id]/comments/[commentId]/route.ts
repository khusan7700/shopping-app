import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  content: z.string().min(1, "댓글을 입력해주세요").max(500, "500자 이내로 작성해주세요"),
});

// PATCH /api/products/[id]/comments/[commentId] — 본인 댓글만 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { commentId } = await params;

  const existing = await prisma.productComment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updated = await prisma.productComment.update({
    where: { id: commentId },
    data: { content: parsed.data.content },
    include: {
      user: { select: { id: true, name: true, phone: true } },
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/products/[id]/comments/[commentId] — 본인 댓글만 삭제
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { commentId } = await params;

  const existing = await prisma.productComment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  await prisma.productComment.delete({ where: { id: commentId } });

  return NextResponse.json({ success: true });
}
