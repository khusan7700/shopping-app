"use client";

import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    alert(`"${product.name}"을(를) 장바구니에 담았습니다.`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
    >
      장바구니 담기
    </button>
  );
}
