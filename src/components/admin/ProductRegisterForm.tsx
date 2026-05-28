"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { productSchema, ProductFormData } from "@/schemas/product.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// API 호출 함수 — useMutation 의 mutationFn 으로 전달
async function createProduct(data: ProductFormData) {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "상품 등록 중 오류가 발생했습니다.");
  }
  return res.json();
}

export function ProductRegisterForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      reset();
      setOpen(false);
      router.refresh(); // Server Component 재실행 → 목록 자동 갱신
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>+ 상품 등록</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>신규 상품 등록</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="grid grid-cols-1 gap-4 mt-2"
        >
          {/* 서버 에러 */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
              {error.message}
            </p>
          )}

          {/* 상품명 */}
          <div className="space-y-1">
            <Label htmlFor="name">
              상품명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="예) 클래식 화이트 티셔츠"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* 가격 / 재고 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="price">
                가격 (원) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                {...register("price", { valueAsNumber: true })}
                type="number"
                placeholder="29000"
                min={1}
              />
              {errors.price && (
                <p className="text-red-500 text-xs">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="stock">
                재고 (개) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                {...register("stock", { valueAsNumber: true })}
                type="number"
                placeholder="100"
                min={0}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* 카테고리 / 이미지 URL */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="category">카테고리</Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="예) 상의, 하의"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="imageUrl">이미지 경로</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="/images/products/..."
              />
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="space-y-1">
            <Label htmlFor="description">상품 설명</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="상품에 대한 간단한 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "등록 중..." : "등록하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
