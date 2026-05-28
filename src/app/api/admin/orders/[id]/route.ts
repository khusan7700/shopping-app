import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function checkAdmin() {
  const session = await auth();
  return session && (session.user as any)?.role === "admin" ? session : null;
}

const DELIVERY_STATUSES = ["PAID", "SHIPPING", "DONE"] as const;
type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  PAID: "배달 준비",
  SHIPPING: "배달중",
  DONE: "배달 완료",
};

const NOTIFICATION_TYPES: Record<DeliveryStatus, "ORDER_PLACED" | "ORDER_SHIPPED" | "ORDER_DONE"> = {
  PAID: "ORDER_PLACED",
  SHIPPING: "ORDER_SHIPPED",
  DONE: "ORDER_DONE",
};

// PATCH /api/admin/orders/[id] — 배송 상태 변경
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const { id } = await params;
  const { statusCode } = await req.json();

  if (!DELIVERY_STATUSES.includes(statusCode)) {
    return NextResponse.json({ error: "잘못된 상태값입니다" }, { status: 400 });
  }

  const statusRecord = await prisma.systemCode.findUnique({ where: { code: statusCode } });
  if (!statusRecord) {
    return NextResponse.json({ error: "상태 코드를 찾을 수 없습니다" }, { status: 404 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { statusCodeId: statusRecord.id },
    include: { status: true },
  });

  // 회원에게 상태 변경 알림 발송
  const label = STATUS_LABELS[statusCode as DeliveryStatus];
  await prisma.notification.create({
    data: {
      userId: order.userId,
      type: NOTIFICATION_TYPES[statusCode as DeliveryStatus],
      title: `주문 상태가 변경되었습니다`,
      message: `주문번호 ${id.slice(0, 8)}의 상태가 [${label}](으)로 변경되었습니다.`,
    },
  });

  return NextResponse.json(order);
}
