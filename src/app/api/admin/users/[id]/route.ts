import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function checkAdmin() {
  const session = await auth();
  return session && (session.user as any)?.role === "admin" ? session : null;
}

// PATCH /api/admin/users/[id] — 상태 변경 (active / blocked)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminSession = await checkAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  if (!["active", "blocked"].includes(status)) {
    return NextResponse.json({ error: "잘못된 상태값입니다" }, { status: 400 });
  }

  // 자기 자신 차단 방지
  if ((adminSession.user as any).id === id) {
    return NextResponse.json({ error: "자기 자신의 상태는 변경할 수 없습니다" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  });

  return NextResponse.json(user);
}

// DELETE /api/admin/users/[id] — 회원 삭제
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminSession = await checkAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const { id } = await params;

  if ((adminSession.user as any).id === id) {
    return NextResponse.json({ error: "자기 자신을 삭제할 수 없습니다" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
