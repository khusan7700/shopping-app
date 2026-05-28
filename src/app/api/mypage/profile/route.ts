import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다").optional(),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, "010-0000-0000 형식으로 입력해주세요").optional().or(z.literal("")),
  description: z.string().max(200, "소개는 200자 이내로 작성해주세요").optional(),
  imageUrl: z.string().url("올바른 URL 형식이 아닙니다").optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, description: true, imageUrl: true, createdAt: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const data: Record<string, string | null> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.phone !== undefined) data.phone = parsed.data.phone || null;
  if (parsed.data.description !== undefined) data.description = parsed.data.description || null;
  if (parsed.data.imageUrl !== undefined) data.imageUrl = parsed.data.imageUrl || null;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, phone: true, description: true, imageUrl: true },
  });

  return NextResponse.json(updated);
}
