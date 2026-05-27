import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/products/ProductGrid";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category } = await searchParams;

  // await new Promise((resolve) => setTimeout(resolve, 3000)); // ← 이 줄 추가

  // category 값이 있으면 해당 카테고리만, 없으면 전체 상품 조회
  // URL: /products → category = undefined → 전체
  // URL: /products?category=상의 → category = "상의" → 상의만
  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  // 카테고리 필터 버튼 목록을 만들기 위해 DB에 존재하는 카테고리만 동적으로 조회
  // select: category 컬럼만 가져옴 (id, name 등 불필요한 컬럼 제외)
  // distinct: 중복 제거 (상의가 여러 개여도 "상의" 하나만 반환)
  // where: category가 null인 상품은 제외
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    where: { category: { not: null } },
  });

  // Prisma가 반환한 객체 배열 [{ category: "상의" }, ...]에서 문자열 배열 ["상의", ...]로 변환
  // filter(Boolean): null/undefined가 섞여 있을 경우 제거, as string[]로 타입 단언
  const categoryList = categories
    .map((p) => p.category)
    .filter(Boolean) as string[];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <a
          href="/products"
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
            !category
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
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
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {/* 상품 목록 */}
      <ProductGrid products={products} />
    </div>
  );
}
