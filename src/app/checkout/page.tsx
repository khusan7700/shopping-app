"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cartStore";
import { orderSchema, OrderFormData } from "@/schemas/order.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  // 장바구니가 비어 있으면 상품 목록으로 리다이렉트 (useEffect 사용 필수)
  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items.length, router]); // items.length 변경 시마다

  // 장바구니가 비어 있으면 상품 목록으로 리다이렉트
  if (items.length === 0) {
    return null;
  }

  const onSubmit = async (data: OrderFormData) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "주문 처리 중 오류가 발생했습니다");
        return;
      }

      // 주문 성공 → 장바구니 비우기 → 완료 페이지 이동
      clearCart();
      router.push("/order-complete");
    } catch {
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">주문하기</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 주문 폼 */}
        <div>
          <h2 className="font-semibold text-lg mb-4">배송지 정보</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                받는 분 이름
              </label>
              <Input {...register("receiverName")} placeholder="홍길동" />
              {errors.receiverName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.receiverName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                전화번호
              </label>
              <Input
                {...register("receiverPhone")}
                placeholder="010-1234-5678"
              />
              {errors.receiverPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.receiverPhone.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                배송 주소
              </label>
              <Input
                {...register("address")}
                placeholder="서울시 강남구 테헤란로 123"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? "처리 중..." : "결제하기"}
            </Button>
          </form>
        </div>

        {/* 주문 요약 */}
        <div>
          <h2 className="font-semibold text-lg mb-4">주문 상품</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {(item.price * item.quantity).toLocaleString("ko-KR")}원
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
              <span>총 결제금액</span>
              <span>{totalPrice().toLocaleString("ko-KR")}원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
