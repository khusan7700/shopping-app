"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

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

export function ProductCard({
  product,
  priority = false,
  initialLiked = false,
}: {
  product: Product;
  priority?: boolean;
  initialLiked?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);

  const discountRate = (product.name.length % 30) + 10;
  const originalPrice = Math.floor(product.price / (1 - discountRate / 100));
  const isFreeShipping = product.price >= 30000;

  // 장바구니 즉시 추가
  const [cartAdded, setCartAdded] = useState(false);
  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1800);
  };

  // 좋아요 토글 — initialLiked는 서버에서 내려온 실제 DB 상태
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(product._count?.likes ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    if (!wasLiked) setBurst(true);

    try {
      const res = await fetch(`/api/products/${product.id}/like`, { method: "POST" });
      if (res.status === 401) {
        // 로그인 필요 → rollback
        setLiked(wasLiked);
        setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
        alert("좋아요를 누르려면 로그인이 필요합니다.");
      } else {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setLikeLoading(false);
      setTimeout(() => setBurst(false), 600);
    }
  };

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* gradient glow border on hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/40 group-hover:via-purple-500/30 group-hover:to-cyan-500/40 transition-all duration-500 blur-sm pointer-events-none" />

      <div className="relative glass rounded-2xl overflow-hidden p-3">

        {/* ── 이미지 영역 (클릭 시 상품 상세로 이동) ── */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden bg-white/5 mb-3">

          {/* 품절 오버레이 */}
          {product.stock === 0 && (
            <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
              <span className="text-xs font-bold text-red-400 border border-red-400/30 px-3 py-1 rounded-full bg-red-400/10">품절</span>
            </div>
          )}

          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">이미지 없음</div>
          )}

          {/* Discount badge */}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
            -{discountRate}%
          </div>

          {/* 무료배송 badge (like 버튼 없을 때만) */}
          {isFreeShipping && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 group-hover:opacity-0 transition-opacity">
              무료배송
            </div>
          )}

          {/* ── Like 버튼 (hover 시 표시) ── */}
          <motion.button
            onClick={handleLike}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-xl glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            title="좋아요"
          >
            {/* burst particles */}
            <AnimatePresence>
              {burst && [...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 72 * Math.PI) / 180) * 20,
                    y: Math.sin((i * 72 * Math.PI) / 180) * 20,
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute w-1 h-1 rounded-full bg-red-400 pointer-events-none"
                />
              ))}
            </AnimatePresence>

            <motion.span
              animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Heart
                size={14}
                className={liked ? "fill-red-400 text-red-400" : "text-white"}
                strokeWidth={2}
              />
            </motion.span>
          </motion.button>

          {/* ── 바로 장바구니 버튼 (hover 시 이미지 아래에서 슬라이드업) ── */}
          <motion.button
            onClick={handleAddCart}
            disabled={product.stock === 0}
            className={`absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out ${
              product.stock === 0
                ? "bg-gray-600 cursor-not-allowed"
                : cartAdded
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500"
            }`}
          >
            <AnimatePresence mode="wait">
              {cartAdded ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  ✓ 담겼습니다!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingCart size={13} />
                  바로 장바구니
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </Link>

        {/* ── 텍스트 영역 ── */}
        <Link href={`/products/${product.id}`} className="block">
          <div className="flex flex-col gap-1 px-1">
            <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
              {product.name}
            </h3>

            <span className="text-[10px] text-muted-foreground line-through">
              {originalPrice.toLocaleString("ko-KR")}원
            </span>

            <div className="flex items-center justify-between">
              <span className="font-bold text-base gradient-text">
                {product.price.toLocaleString("ko-KR")}원
              </span>
              {isFreeShipping && (
                <span className="text-[9px] text-cyan-400 font-medium">무료배송</span>
              )}
            </div>

            {/* stats */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] flex items-center gap-0.5 transition-colors ${liked ? "text-red-400" : "text-muted-foreground"}`}>
                <Heart size={9} className={liked ? "fill-red-400" : ""} strokeWidth={2} />
                {likeCount}
              </span>
              {product._count !== undefined && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  👁 {product._count.views}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
