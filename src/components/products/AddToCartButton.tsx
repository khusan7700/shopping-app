"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      className="relative w-full py-4 rounded-xl font-semibold text-base overflow-hidden glow-btn text-white"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span
            key="added"
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ✓ 담겼습니다!
          </motion.span>
        ) : (
          <motion.span
            key="default"
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            🛒 장바구니 담기
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
