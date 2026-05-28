"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
  _count?: { likes: number; views: number };
}

interface ProductGridProps {
  products: Product[];
  likedProductIds?: Set<string>;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function ProductGrid({ products, likedProductIds }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        className="text-center py-16 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-lg">상품이 없습니다.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={cardVariant}>
          <ProductCard
            product={product}
            priority={index < 4}
            initialLiked={likedProductIds?.has(product.id) ?? false}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
