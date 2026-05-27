import { prisma } from "@/lib/db";
import { ProductRegisterForm } from "@/components/admin/ProductRegisterForm";
import Image from "next/image";

export default async function AdminPage() {
  // Server Component에서 직접 Prisma 조회
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* 페이지 헤더 + 등록 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            총 {products.length}개 상품
          </p>
        </div>
        {/* Client Component — 등록 폼 토글 */}
        <ProductRegisterForm />
      </div>

      {/* 상품 목록 테이블 */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">
                이미지
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                상품명
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">
                카테고리
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-28">
                가격
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-20">
                재고
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                {/* 이미지 */}
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        📦
                      </div>
                    )}
                  </div>
                </td>

                {/* 상품명 + 설명 */}
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                      {product.description}
                    </p>
                  )}
                </td>

                {/* 카테고리 */}
                <td className="px-4 py-3">
                  {product.category ? (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                      {product.category}
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>

                {/* 가격 */}
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {product.price.toLocaleString("ko-KR")}원
                </td>

                {/* 재고 — 10개 이하면 빨간색 경고 */}
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      product.stock <= 10
                        ? "text-red-500 font-semibold"
                        : "text-gray-700"
                    }
                  >
                    {product.stock}개
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 상품이 없을 때 */}
        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📦</p>
            <p>등록된 상품이 없습니다.</p>
            <p className="text-sm mt-1">위의 &apos;+ 상품 등록&apos; 버튼으로 첫 상품을 추가하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
