"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ProductEditForm } from "./ProductEditForm";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
}

export function AdminProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleUpdated = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleted = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      {/* 모바일: 카드 목록 */}
      <div className="flex flex-col gap-3 sm:hidden">
        <AnimatePresence initial={false}>
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-xl flex items-center gap-3 px-4 py-3"
            >
              <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white/10">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{product.category ?? "카테고리 없음"}</p>
              </div>
              <div className="text-right shrink-0 mr-1">
                <p className="text-sm font-semibold">{product.price.toLocaleString("ko-KR")}원</p>
                <p className={`text-xs mt-0.5 ${product.stock <= 10 ? "text-red-400 font-medium" : "text-gray-400"}`}>
                  재고 {product.stock}개
                </p>
              </div>
              <ProductEditForm product={product} onUpdated={handleUpdated} onDeleted={handleDeleted} />
            </motion.div>
          ))}
        </AnimatePresence>
        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📦</p>
            <p className="text-sm">등록된 상품이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 태블릿/데스크톱: 테이블 */}
      <div className="hidden sm:block glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr>
              {["이미지", "상품명", "카테고리", "가격", "재고", ""].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wide ${
                    i === 0 ? "text-left w-16" :
                    i === 1 ? "text-left" :
                    i === 2 ? "text-left w-24 hidden md:table-cell" :
                    i === 5 ? "w-10" :
                    "text-right " + (i === 3 ? "w-28" : "w-20")
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  layout
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white/10">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{product.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {product.category ? (
                      <span className="inline-block whitespace-nowrap bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {product.price.toLocaleString("ko-KR")}원
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${product.stock <= 10 ? "text-red-400" : "text-gray-300"}`}>
                      {product.stock}개
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ProductEditForm product={product} onUpdated={handleUpdated} onDeleted={handleDeleted} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-3">📦</p>
            <p className="mb-1">등록된 상품이 없습니다.</p>
            <p className="text-sm text-gray-500">&apos;+ 상품 등록&apos; 버튼으로 첫 상품을 추가하세요.</p>
          </div>
        )}
      </div>
    </>
  );
}
