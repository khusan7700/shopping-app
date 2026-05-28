import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProductGrid } from "@/components/products/ProductGrid";
import { PageTransition } from "@/components/motion/PageTransition";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  const session = await auth();

  const [products, categories, likedRows] = await Promise.all([
    prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { likes: true, views: true } } },
    }),
    prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
    }),
    session?.user?.id
      ? prisma.productLike.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : [],
  ]);

  const categoryList = categories.map((p) => p.category).filter(Boolean) as string[];
  const likedProductIds = new Set(likedRows.map((r) => r.productId));

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <a
          href="/products"
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
            !category
              ? "glow-btn border-transparent"
              : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
          }`}
        >
          전체
        </a>
        {categoryList.map((cat) => (
          <a
            key={cat}
            href={`/products?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              category === cat
                ? "glow-btn border-transparent"
                : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      <ProductGrid products={products} likedProductIds={likedProductIds} />
    </PageTransition>
  );
}
