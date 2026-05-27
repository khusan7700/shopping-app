import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { AddToCartButton } from "@/components/products/AddToCartButton";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 상품 이미지 */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
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
            <div className="flex items-center justify-center h-full text-gray-400">
              이미지 없음
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col justify-between py-4">
          <div>
            {product.category && (
              <span className="text-sm text-gray-400 mb-2 block">
                {product.category}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {product.price.toLocaleString("ko-KR")}원
            </p>
            <p className="text-sm text-gray-400">
              재고: {product.stock > 0 ? `${product.stock}개` : "품절"}
            </p>
          </div>

          {/* 장바구니 담기 버튼 — Client Component */}
          <div className="mt-8">
            {product.stock > 0 ? (
              <AddToCartButton product={product} />
            ) : (
              <button
                disabled
                className="w-full py-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
              >
                품절된 상품입니다
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
