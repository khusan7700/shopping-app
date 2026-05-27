"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "@/schemas/product.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductRegisterForm() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "상품 등록 중 오류가 발생했습니다");
        return;
      }

      // 성공: 폼 초기화 → 닫기 → 목록 갱신
      reset();
      setIsOpen(false);
      router.refresh(); // Server Component 재실행 → 상품 목록 자동 갱신
    } catch {
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <div>
      {/* 토글 버튼 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant={isOpen ? "outline" : "default"}
      >
        {isOpen ? "✕ 닫기" : "+ 상품 등록"}
      </Button>

      {/* 등록 폼 패널 */}
      {isOpen && (
        <div className="mt-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h2 className="text-lg font-semibold mb-5">신규 상품 등록</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 상품명 */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                상품명 <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("name")}
                placeholder="예) 클래식 화이트 티셔츠"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 가격 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                가격 (원) <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("price", { valueAsNumber: true })}
                type="number"
                placeholder="29000"
                min={1}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* 재고 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                재고 (개) <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                placeholder="100"
                min={0}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* 카테고리 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                카테고리
              </label>
              <Input
                {...register("category")}
                placeholder="예) 상의, 하의, 가방"
              />
            </div>

            {/* 이미지 URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                이미지 경로
              </label>
              <Input
                {...register("imageUrl")}
                placeholder="예) /images/products/product1.jpg"
              />
            </div>

            {/* 상품 설명 */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                상품 설명
              </label>
              <Input
                {...register("description")}
                placeholder="상품에 대한 간단한 설명을 입력하세요"
              />
            </div>

            {/* 액션 버튼 */}
            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "등록 중..." : "등록하기"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
