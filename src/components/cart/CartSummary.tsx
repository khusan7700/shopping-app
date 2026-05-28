"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export function CartSummary() {
  const totalPrice = useCartStore((state) => state.totalPrice());
  const items = useCartStore((state) => state.items);
  const shipping = totalPrice >= 50000 ? 0 : 3000;
  const finalPrice = totalPrice + shipping;
  const freeShippingGap = 50000 - totalPrice;

  if (items.length === 0) return null;

  return (
    <motion.div
      className="glass-strong rounded-2xl p-6 sticky top-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h2 className="font-bold text-lg mb-5 gradient-text">결제 금액</h2>

      <div className="space-y-3 mb-5 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>상품 금액</span>
          <span>{totalPrice.toLocaleString("ko-KR")}원</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>배송비</span>
          <span className={shipping === 0 ? "text-cyan-400 font-medium" : ""}>
            {shipping === 0 ? "무료" : "3,000원"}
          </span>
        </div>
      </div>

      {freeShippingGap > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>무료배송까지</span>
            <span className="text-indigo-300">{freeShippingGap.toLocaleString("ko-KR")}원 남음</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalPrice / 50000) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <div className="border-t border-white/10 pt-4 mb-6">
        <div className="flex justify-between font-bold text-lg">
          <span>총 결제금액</span>
          <span className="gradient-text">{finalPrice.toLocaleString("ko-KR")}원</span>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <Link
          href="/checkout"
          className="glow-btn block w-full text-center py-3.5 text-white rounded-xl font-semibold text-sm tracking-wide"
        >
          주문하기 →
        </Link>
      </motion.div>
    </motion.div>
  );
}
