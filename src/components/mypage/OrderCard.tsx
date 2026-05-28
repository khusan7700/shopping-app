"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300",
  PAID: "bg-blue-500/20 text-blue-300",
  SHIPPING: "bg-purple-500/20 text-purple-300",
  DONE: "bg-green-500/20 text-green-300",
};

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; imageUrl: string | null } | null;
}

interface Order {
  id: string;
  totalPrice: number;
  createdAt: string;
  status: { code: string; label: string };
  orderItems: OrderItem[];
}

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const statusStyle = STATUS_STYLE[order.status.code] ?? "bg-white/10 text-gray-300";
  const orderDate = new Date(order.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      className="border border-white/10 bg-white/5 rounded-xl p-5 space-y-4 backdrop-blur-sm"
      whileHover={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.08)" }}
      transition={{ duration: 0.2 }}
    >
      {/* 주문 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{orderDate}</p>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            주문번호: {order.id.slice(0, 8)}...
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}>
          {order.status.label}
        </span>
      </div>

      {/* 주문 상품 목록 */}
      <div className="space-y-3">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white/10">
              {item.product?.imageUrl ? (
                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">없음</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {item.product?.name ?? "삭제된 상품"}
              </p>
              <p className="text-xs text-gray-400">
                {item.price.toLocaleString("ko-KR")}원 × {item.quantity}개
              </p>
            </div>
            <p className="text-sm font-bold flex-shrink-0">
              {(item.price * item.quantity).toLocaleString("ko-KR")}원
            </p>
          </div>
        ))}
      </div>

      {/* 총 결제금액 */}
      <div className="border-t border-white/10 pt-3 flex justify-between items-center">
        <span className="text-sm text-gray-400">총 결제금액</span>
        <span className="font-bold">{order.totalPrice.toLocaleString("ko-KR")}원</span>
      </div>
    </motion.div>
  );
}
