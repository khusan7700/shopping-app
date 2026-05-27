import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ── GET: 내 주문 목록 조회 ─────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: { product: true }, // 상품명·이미지 포함
      },
      status: true, // 배송 상태 label 포함
    },
    orderBy: { createdAt: "desc" }, // 최신 주문부터
  });

  return NextResponse.json(orders);
}

// POST /api/orders: 주문 생성
export async function POST(request: NextRequest) {
  // ── 1. 로그인 여부 확인 ────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  // ── 2. 요청 바디 파싱 ──────────────────────────────
  const body = await request.json();
  const { receiverName, receiverPhone, address, items } = body;

  // ── 3. 기본 유효성 검사 ────────────────────────────
  if (!receiverName || !receiverPhone || !address) {
    return NextResponse.json(
      { error: "배송지 정보가 누락되었습니다" },
      { status: 400 },
    );
  }

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "장바구니가 비어 있습니다" },
      { status: 400 },
    );
  }

  // ── 4. 총 금액 계산 ────────────────────────────────
  const totalPrice = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0,
  );

  try {
    // ── 5. Prisma Transaction ──────────────────────
    const order = await prisma.$transaction(async (tx) => {
      // 5-1. Order 생성
      // 5-1. Order 생성
      const newOrder = await tx.order.create({
        data: {
          user: {
            connect: { id: session.user!.id! }, // 🟢 수정된 부분: user를 객체로 연결
          },
          status: {
            connect: { code: "PENDING" }, // 🟢 status도 객체로 연결 (일관성 유지!)
          },
          receiverName,
          receiverPhone,
          address,
          totalPrice,
        },
      });

      // 5-2. OrderItem 생성 (장바구니 아이템 수만큼)
      await tx.orderItem.createMany({
        data: items.map(
          (item: { id: string; price: number; quantity: number }) => ({
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          }),
        ),
      });

      return newOrder;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("주문 생성 실패:", error);
    return NextResponse.json(
      { error: "주문 처리 중 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
