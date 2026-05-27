import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean; // LCP 최적화를 위해 상단 이미지에 priority 속성 추가
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  // 실제 서비스라면 DB에 있을 데이터지만, UI 디자인 실습을 위해 가상으로 계산합니다.
  const discountRate = (product.name.length % 30) + 10; // 10~40% 랜덤 할인율
  const originalPrice = Math.floor(product.price / (1 - discountRate / 100));
  const isFreeShipping = product.price >= 30000;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="flex flex-col gap-3">
        {/* 1. 상품 이미지 영역 */}
        <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              이미지 없음
            </div>
          )}
        </div>

        {/* 2. 상품 텍스트 정보 영역 */}
        <div className="flex flex-col gap-1">
          {/* 상품명 */}
          <h3 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* 원가 (취소선) */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500">쿠폰적용가</span>
            <span className="text-xs text-gray-400 line-through">
              {originalPrice.toLocaleString("ko-KR")}원
            </span>
          </div>

          {/* 할인가격 영역 */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-600 text-lg">
              {discountRate}%
            </span>
            <span className="font-bold text-gray-900 text-lg">
              {product.price.toLocaleString("ko-KR")}원
            </span>
          </div>

          {/* 배송비 정보 */}
          <span className="text-xs text-gray-500 mt-1">
            {isFreeShipping ? "무료배송" : "배송비 3,000원"}
          </span>

          {/* 추가 배지 (스마일배송 등) */}
          {isFreeShipping && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
                빠른배송
              </span>
              <span className="text-[11px] text-gray-600 font-medium">
                내일 도착 보장
              </span>
            </div>
          )}

          {/* 품절 표시 */}
          {product.stock === 0 && (
            <span className="text-xs text-red-500 mt-1 block font-bold">
              품절된 상품입니다
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
