import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function checkAdmin() {
  const session = await auth();
  return session && (session.user as any)?.role === "admin" ? session : null;
}

// GET /api/admin/orders — 전체 주문 목록
export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      status: true,
      user: {
        select: { id: true, name: true, email: true, phone: true, imageUrl: true },
      },
      orderItems: {
        include: {
          product: { select: { id: true, name: true, imageUrl: true, price: true } },
        },
      },
    },
  });

  return NextResponse.json(orders);
}
