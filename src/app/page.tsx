import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProductGrid } from "@/components/products/ProductGrid";
import { PageTransition } from "@/components/motion/PageTransition";
import { MotionDiv } from "@/components/motion/MotionDiv";

export default async function HomePage() {
  const session = await auth();

  const [products, likedRows] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { likes: true, views: true } } },
    }),
    session?.user?.id
      ? prisma.productLike.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : [],
  ]);

  const likedProductIds = new Set(likedRows.map((r) => r.productId));

  return (
    <PageTransition>
      {/* Hero */}
      <MotionDiv
        className="relative text-center py-16 mb-12 overflow-hidden rounded-3xl glass"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4">
              ✦ 최신 컬렉션
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4 leading-tight">
              트렌드를 입다
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              엄선된 프리미엄 상품을 합리적인 가격에. 오늘의 특가를 놓치지 마세요.
            </p>
          </MotionDiv>

          <MotionDiv
            className="flex gap-3 justify-center mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <a href="/products" className="glow-btn text-white text-sm font-semibold px-6 py-3 rounded-xl inline-block">
              전체 상품 보기 →
            </a>
            <a href="/products?category=상의" className="glass text-sm text-muted-foreground hover:text-foreground px-6 py-3 rounded-xl inline-block transition-colors">
              카테고리 둘러보기
            </a>
          </MotionDiv>
        </div>
      </MotionDiv>

      {/* 상품 목록 */}
      <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-bold">신상품</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <ProductGrid products={products} likedProductIds={likedProductIds} />
      </MotionDiv>
    </PageTransition>
  );
}
