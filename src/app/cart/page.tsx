"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { PageTransition } from "@/components/motion/PageTransition";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="text-center py-20">
          <motion.p
            className="text-5xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            🛒
          </motion.p>
          <p className="text-lg text-gray-300 mb-6">장바구니가 비어 있습니다</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/products"
              className="inline-block bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              쇼핑 계속하기
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </PageTransition>
  );
}
