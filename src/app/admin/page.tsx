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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {products.length}개 상품</p>
        </div>
        <ProductRegisterForm />
      </div>

      {/* ── 모바일: 카드 목록 ── */}
      <div className="flex flex-col gap-2 sm:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 px-3 py-3 border border-gray-200 rounded-xl bg-white"
          >
            {/* 이미지 */}
            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
              )}
            </div>

            {/* 상품명 + 카테고리 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate leading-snug">
                {product.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {product.category ?? "카테고리 없음"}
              </p>
            </div>

            {/* 가격 + 재고 */}
            <div className="text-right shrink-0 pl-2">
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {product.price.toLocaleString("ko-KR")}원
              </p>
              <p className={`text-xs mt-0.5 whitespace-nowrap ${
                product.stock <= 10 ? "text-red-500 font-medium" : "text-gray-400"
              }`}>
                재고 {product.stock}개
              </p>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📦</p>
            <p className="text-sm">등록된 상품이 없습니다.</p>
          </div>
        )}
      </div>

      {/* ── 태블릿/데스크톱: 테이블 ── */}
      <div className="hidden sm:block border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">이미지</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">상품명</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24 hidden md:table-cell">카테고리</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-28">가격</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-20">재고</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{product.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {product.category ? (
                    <span className="inline-block whitespace-nowrap bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                      {product.category}
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {product.price.toLocaleString("ko-KR")}원
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={product.stock <= 10 ? "text-red-500 font-semibold" : "text-gray-700"}>
                    {product.stock}개
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
