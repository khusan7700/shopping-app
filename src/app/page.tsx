import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/products/ProductGrid";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      <ProductGrid products={products} />
    </div>
  );
}
