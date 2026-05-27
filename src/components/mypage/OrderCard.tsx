import Image from "next/image";

// 배송 상태별 색상 정의
const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100   text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100  text-green-700",
};

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string | null;
  } | null;
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
  const statusStyle =
    STATUS_STYLE[order.status.code] ?? "bg-gray-100 text-gray-700";
  const orderDate = new Date(order.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-4">
      {/* 주문 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{orderDate}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            주문번호: {order.id.slice(0, 8)}...
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}
        >
          {order.status.label}
        </span>
      </div>

      {/* 주문 상품 목록 */}
      <div className="space-y-3">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {item.product?.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  없음
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.product?.name ?? "삭제된 상품"}
              </p>
              <p className="text-xs text-gray-500">
                {item.price.toLocaleString("ko-KR")}원 × {item.quantity}개
              </p>
            </div>
            <p className="text-sm font-bold text-gray-900 flex-shrink-0">
              {(item.price * item.quantity).toLocaleString("ko-KR")}원
            </p>
          </div>
        ))}
      </div>

      {/* 총 결제금액 */}
      <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">총 결제금액</span>
        <span className="font-bold text-gray-900">
          {order.totalPrice.toLocaleString("ko-KR")}원
        </span>
      </div>
    </div>
  );
}
