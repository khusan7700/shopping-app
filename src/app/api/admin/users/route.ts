import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function checkAdmin() {
  const session = await auth();
  return session && (session.user as any)?.role === "admin" ? session : null;
}

// GET /api/admin/users — 전체 회원 목록
export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
      role: true,
      status: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { address: true },
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  return NextResponse.json(users);
}
