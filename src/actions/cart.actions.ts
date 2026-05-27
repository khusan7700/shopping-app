"use server";

import { prisma } from "@/lib/db";
import { CartItem } from "@/store/cartStore";

// 1. 상태 동기화 (로컬 장바구니 -> DB로 통째로 덮어쓰기)
export async function syncCartToDbAction(userId: string, items: CartItem[]) {
  // 사용자의 기존 Cart 찾기 (없으면 새로 생성)
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // 트랜잭션(Transaction): 안전하게 지우고 새로 쓰기를 한 번에 처리
  await prisma.$transaction([
    // 1) 기존에 DB에 있던 이 사용자의 장바구니 아이템을 모두 삭제
    prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    // 2) 브라우저에서 넘어온 최신 장바구니 배열을 DB에 통째로 삽입(Bulk Insert)
    prisma.cartItem.createMany({
      data: items.map((item) => ({
        cartId: cart.id,
        productId: item.id,
        quantity: item.quantity,
      })),
    }),
  ]);

  return { success: true };
}

// 2. 상태 복원 (DB 장바구니 -> 브라우저로 가져오기)
export async function getCartFromDbAction(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: { product: true },
      },
    },
  });

  if (!cart) return [];

  // 프론트엔드의 Zustand(CartItem) 타입에 딱 맞게 변환하여 리턴
  return cart.cartItems.map((item) => ({
    id: item.productId,
    name: item.product.name,
    price: item.product.price,
    imageUrl: item.product.imageUrl,
    quantity: item.quantity,
  }));
}
