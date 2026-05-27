"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export function CartSummary() {
  const totalPrice = useCartStore((state) => state.totalPrice());
  const items = useCartStore((state) => state.items);

  if (items.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
      <h2 className="font-bold text-lg mb-4">결제 금액</h2>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>상품 금액</span>
          <span>{totalPrice.toLocaleString("ko-KR")}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>배송비</span>
          <span>{totalPrice >= 50000 ? "무료" : "3,000원"}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between font-bold text-lg">
          <span>총 결제금액</span>
          <span>
            {(totalPrice >= 50000
              ? totalPrice
              : totalPrice + 3000
            ).toLocaleString("ko-KR")}
            원
          </span>
        </div>
        {totalPrice < 50000 && (
          <p className="text-xs text-gray-400 mt-1">
            {(50000 - totalPrice).toLocaleString("ko-KR")}원 더 담으면 무료 배송
          </p>
        )}
      </div>

      <Link
        href="/checkout"
        className="block w-full text-center py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        주문하기
      </Link>
    </div>
  );
}
