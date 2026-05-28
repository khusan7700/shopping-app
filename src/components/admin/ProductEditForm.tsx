"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { productSchema, ProductFormData } from "@/schemas/product.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
}

const inputCls =
  "w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all";
const labelCls =
  "text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wide";

export function ProductEditForm({ product, onUpdated, onDeleted }: {
  product: Product;
  onUpdated: (updated: Product) => void;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category ?? "",
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category ?? "",
        description: product.description ?? "",
        imageUrl: product.imageUrl ?? "",
      });
    }
    setOpen(next);
  };

  const onSubmit = async (data: ProductFormData) => {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "수정 중 오류가 발생했습니다.");
    }
    const updated = await res.json();
    onUpdated(updated);
    setOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`"${product.name}" 상품을 삭제하시겠습니까?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 중 오류가 발생했습니다.");
      onDeleted(product.id);
      setOpen(false);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="수정"
        >
          <Pencil size={14} />
        </motion.button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-[#1a1040] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="gradient-text text-lg">상품 수정</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 mt-2">
          <div>
            <label className={labelCls}>상품명 <span className="text-red-400">*</span></label>
            <input {...register("name")} placeholder="예) 클래식 화이트 티셔츠" className={inputCls} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>가격 (원) <span className="text-red-400">*</span></label>
              <input {...register("price", { valueAsNumber: true })} type="number" placeholder="29000" min={1} className={inputCls} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelCls}>재고 (개) <span className="text-red-400">*</span></label>
              <input {...register("stock", { valueAsNumber: true })} type="number" placeholder="100" min={0} className={inputCls} />
              {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>카테고리</label>
              <input {...register("category")} placeholder="예) 상의, 하의" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>이미지 경로</label>
              <input {...register("imageUrl")} placeholder="/images/..." className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>상품 설명</label>
            <textarea
              {...register("description")}
              placeholder="상품에 대한 간단한 설명을 입력하세요"
              rows={3}
              className={inputCls + " resize-none"}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <motion.button
              type="button"
              onClick={handleDelete}
              disabled={deleting || isSubmitting}
              className="px-4 py-2 rounded-xl text-sm border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {deleting ? "삭제 중..." : "🗑️ 삭제"}
            </motion.button>

            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting || deleting}
                className="px-4 py-2 rounded-xl text-sm border border-white/15 text-gray-300 hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                취소
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting || deleting}
                className="glow-btn px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? "저장 중..." : "저장하기"}
              </motion.button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
