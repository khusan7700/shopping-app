"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/mypage/OrderCard";

// API 호출 함수 (useQuery의 queryFn으로 사용)
async function fetchOrders() {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error("주문 내역을 불러오는 데 실패했습니다");
  }
  return response.json();
}

export default function MyPage() {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"], // 캐시 키 — 같은 키면 캐시 재사용
    queryFn: fetchOrders,
  });

  // 로딩 중
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // 에러 발생
  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-2">주문 내역을 불러오지 못했습니다</p>
        <p className="text-sm text-gray-400">{(error as Error).message}</p>
      </div>
    );
  }

  // 주문 없음
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">📦</p>
        <p className="text-lg text-gray-500 mb-6">아직 주문 내역이 없습니다</p>
        <a
          href="/products"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          쇼핑하러 가기
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
      <div className="space-y-4">
        {orders.map((order: Parameters<typeof OrderCard>[0]["order"]) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
