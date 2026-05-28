"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { syncCartToDbAction, getCartFromDbAction } from "@/actions/cart.actions";

interface CartBadgeProps {
  userId?: string;
  iconOnly?: boolean;
}

export function CartBadge({ userId, iconOnly = false }: CartBadgeProps) {
  const items = useCartStore((state) => state.items);
  const totalCount = useCartStore((state) => state.totalCount());
  const setCart = useCartStore((state) => state.setCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!userId) return;
    if (!isInitialized.current) {
      getCartFromDbAction(userId).then((dbItems) => {
        if (dbItems.length > 0 && items.length === 0) setCart(dbItems);
        else if (items.length > 0) syncCartToDbAction(userId, items);
        isInitialized.current = true;
      });
      return;
    }
    syncCartToDbAction(userId, items);
  }, [userId, items, setCart]);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-1.5 w-8 h-8 rounded-xl glass justify-center hover:scale-110 transition-transform text-foreground"
      title="장바구니"
    >
      <ShoppingCart size={16} />
      <AnimatePresence>
        {mounted && totalCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-lg shadow-indigo-500/40"
          >
            {totalCount > 9 ? "9+" : totalCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
