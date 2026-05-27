"use client";

import Image from "next/image";
import { useCartStore, CartItem as CartItemType } from "@/store/cartStore";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      {/* 상품 이미지 */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">
            없음
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
          {item.name}
        </p>
        <p className="text-gray-900 font-bold">
          {item.price.toLocaleString("ko-KR")}원
        </p>

        {/* 수량 조절 */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
          >
            −
          </button>
          <span className="text-sm font-medium w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* 소계 + 삭제 */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.id)}
          className="text-gray-300 hover:text-red-400 text-lg leading-none"
          aria-label="삭제"
        >
          ✕
        </button>
        <p className="text-sm font-bold text-gray-900">
          {(item.price * item.quantity).toLocaleString("ko-KR")}원
        </p>
      </div>
    </div>
  );
}
