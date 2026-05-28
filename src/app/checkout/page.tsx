"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { orderSchema, OrderFormData } from "@/schemas/order.schema";
import { useEffect } from "react";
import { PageTransition } from "@/components/motion/PageTransition";

const fieldVariant = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.35 },
  }),
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    if (items.length === 0) router.push("/products");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const shipping = totalPrice() >= 50000 ? 0 : 3000;

  const onSubmit = async (data: OrderFormData) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({ id: item.id, price: item.price, quantity: item.quantity })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "주문 처리 중 오류가 발생했습니다");
        return;
      }

      clearCart();
      router.push("/order-complete");
    } catch {
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const fields = [
    { name: "receiverName" as const, label: "받는 분 이름", placeholder: "홍길동" },
    { name: "receiverPhone" as const, label: "전화번호", placeholder: "010-1234-5678" },
    { name: "address" as const, label: "배송 주소", placeholder: "서울시 강남구 테헤란로 123" },
  ];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 gradient-text">주문하기</h1>
        <p className="text-gray-400 text-sm mb-8">배송 정보를 입력해주세요</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 주문 폼 */}
          <motion.div
            className="glass-strong rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center font-bold">1</span>
              배송지 정보
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {fields.map((field, i) => (
                <motion.div key={field.name} custom={i} variants={fieldVariant} initial="hidden" animate="show">
                  <label className="text-xs font-medium text-gray-400 block mb-1.5 uppercase tracking-wide">
                    {field.label}
                  </label>
                  <input
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                  {errors[field.name] && (
                    <p className="text-red-400 text-xs mt-1">{errors[field.name]?.message}</p>
                  )}
                </motion.div>
              ))}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="glow-btn w-full mt-2 py-3.5 text-white rounded-xl font-semibold text-sm tracking-wide disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
              >
                {isSubmitting ? "처리 중..." : "결제하기 →"}
              </motion.button>
            </form>
          </motion.div>

          {/* 주문 요약 */}
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="font-semibold text-base mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-center font-bold">2</span>
              주문 상품
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-300 truncate mr-2">
                    {item.name}
                    <span className="text-gray-500 ml-1">×{item.quantity}</span>
                  </span>
                  <span className="font-medium shrink-0">
                    {(item.price * item.quantity).toLocaleString("ko-KR")}원
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>배송비</span>
                <span className={shipping === 0 ? "text-cyan-400" : ""}>{shipping === 0 ? "무료" : "3,000원"}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>총 결제금액</span>
                <span className="gradient-text">{(totalPrice() + shipping).toLocaleString("ko-KR")}원</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
