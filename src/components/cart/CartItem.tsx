"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore, CartItem as CartItemType } from "@/store/cartStore";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-4 py-4 border-b border-white/10 overflow-hidden"
    >
      {/* 상품 이미지 */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/10">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400">없음</div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm line-clamp-2 mb-1">{item.name}</p>
        <p className="font-bold">{item.price.toLocaleString("ko-KR")}원</p>

        {/* 수량 조절 */}
        <div className="flex items-center gap-2 mt-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
          >
            −
          </motion.button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* 소계 + 삭제 */}
      <div className="flex flex-col items-end justify-between">
        <motion.button
          whileHover={{ scale: 1.2, color: "#f87171" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => removeItem(item.id)}
          className="text-gray-400 text-lg leading-none transition-colors"
          aria-label="삭제"
        >
          ✕
        </motion.button>
        <p className="text-sm font-bold">
          {(item.price * item.quantity).toLocaleString("ko-KR")}원
        </p>
      </div>
    </motion.div>
  );
}
