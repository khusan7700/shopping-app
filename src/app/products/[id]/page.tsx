import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { LikeButton } from "@/components/products/LikeButton";
import { ViewTracker } from "@/components/products/ViewTracker";
import { ProductComments } from "@/components/products/ProductComments";
import { PageTransition } from "@/components/motion/PageTransition";
import { MotionDiv } from "@/components/motion/MotionDiv";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  const [product, likeCount, viewCount, comments] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.productLike.count({ where: { productId: id } }),
    prisma.productView.count({ where: { productId: id } }),
    prisma.productComment.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, phone: true } } },
    }),
  ]);

  if (!product) notFound();

  const discountRate = (product.name.length % 30) + 10;
  const originalPrice = Math.floor(product.price / (1 - discountRate / 100));

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 상품 이미지 */}
          <MotionDiv
            className="relative aspect-square rounded-2xl overflow-hidden glass"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">이미지 없음</div>
            )}
            {/* Discount badge */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              -{discountRate}%
            </div>
          </MotionDiv>

          {/* 상품 정보 */}
          <MotionDiv
            className="flex flex-col justify-between py-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <div className="space-y-4">
              {/* 카테고리 + 뷰·좋아요 stats */}
              <div className="flex items-center justify-between">
                {product.category && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
                    {product.category}
                  </span>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {/* 조회수 (서버 초기값, 클라이언트 업데이트) */}
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {viewCount.toLocaleString()}회
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    ♥ {likeCount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 상품명 */}
              <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>

              {/* 설명 */}
              {product.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* 가격 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground line-through">
                    {originalPrice.toLocaleString("ko-KR")}원
                  </span>
                  <span className="text-xs font-bold text-red-400">-{discountRate}%</span>
                </div>
                <p className="text-3xl font-black gradient-text">
                  {product.price.toLocaleString("ko-KR")}원
                </p>
              </div>

              {/* 재고 */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">재고</span>
                {product.stock > 0 ? (
                  <span className={`font-semibold ${product.stock <= 10 ? "text-red-400" : "text-green-400"}`}>
                    {product.stock <= 10 ? `⚠ ${product.stock}개 (품절 임박)` : `${product.stock}개`}
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold">품절</span>
                )}
              </div>
            </div>

            {/* 액션 영역 */}
            <div className="space-y-4 mt-6">
              {/* Like button */}
              <LikeButton productId={id} isLoggedIn={!!session} />

              {/* Cart button */}
              <div className="w-full">
                {product.stock > 0 ? (
                  <AddToCartButton product={product} />
                ) : (
                  <button
                    disabled
                    className="w-full py-4 glass border border-[var(--glass-border)] text-muted-foreground rounded-xl cursor-not-allowed text-sm"
                  >
                    품절된 상품입니다
                  </button>
                )}
              </div>

              {/* View tracker (클라이언트에서 조회수 기록) */}
              <ViewTracker productId={id} />
            </div>
          </MotionDiv>
        </div>

        {/* View & Like stats card */}
        <MotionDiv
          className="mt-8 glass rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-black gradient-text">{viewCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">총 조회수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-red-400">{likeCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">좋아요</p>
          </div>
          <div className="text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-black text-green-400">{product.stock}</p>
            <p className="text-xs text-muted-foreground mt-1">남은 재고</p>
          </div>
        </MotionDiv>

        {/* 댓글 섹션 */}
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <ProductComments
            productId={id}
            initialComments={comments as any}
            currentUserId={session?.user?.id}
          />
        </MotionDiv>
      </div>
    </PageTransition>
  );
}
