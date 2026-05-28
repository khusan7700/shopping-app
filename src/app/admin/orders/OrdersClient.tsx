"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Truck, PackageCheck, Package } from "lucide-react";

interface Product { id: string; name: string; imageUrl: string | null; price: number }
interface OrderItem { id: string; quantity: number; price: number; product: Product }
interface StatusCode { id: string; code: string; label: string }
interface User { id: string; name: string; email: string; phone: string | null; imageUrl: string | null }
interface Order {
  id: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  totalPrice: number;
  createdAt: string;
  status: StatusCode;
  user: User;
  orderItems: OrderItem[];
}

const FLOW: Record<string, { next: string; nextLabel: string; icon: React.ReactNode } | null> = {
  PENDING: { next: "PAID", nextLabel: "배달 준비", icon: <Package size={13} /> },
  PAID:    { next: "SHIPPING", nextLabel: "배달중으로", icon: <Truck size={13} /> },
  SHIPPING:{ next: "DONE", nextLabel: "배달 완료", icon: <PackageCheck size={13} /> },
  DONE:    null,
};

const STATUS_STYLE: Record<string, string> = {
  PENDING:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  PAID:     "bg-blue-500/15 text-blue-400 border-blue-500/25",
  SHIPPING: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  DONE:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

const STATUS_DISPLAY: Record<string, string> = {
  PENDING: "결제대기",
  PAID: "배달 준비",
  SHIPPING: "배달중",
  DONE: "배달 완료",
};

function Avatar({ user }: { user: User }) {
  if (user.imageUrl) {
    return (
      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
        <Image src={user.imageUrl} alt={user.name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300 font-bold text-xs">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}

const ALL_FILTERS = ["ALL", "PENDING", "PAID", "SHIPPING", "DONE"] as const;
type Filter = typeof ALL_FILTERS[number];

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = filter === "ALL" ? orders : orders.filter(o => o.status.code === filter);

  const counts: Record<string, number> = {};
  for (const o of orders) {
    counts[o.status.code] = (counts[o.status.code] ?? 0) + 1;
  }

  const handleAdvance = async (order: Order) => {
    const next = FLOW[order.status.code];
    if (!next) return;
    setLoadingId(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusCode: next.next }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setOrders(prev =>
        prev.map(o => o.id === order.id ? { ...o, status: updated.status } : o)
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {/* 필터 탭 */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filter === "ALL" ? "glow-btn border-transparent" : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
          }`}
        >
          전체 ({orders.length})
        </button>
        {(["PENDING", "PAID", "SHIPPING", "DONE"] as const).map(code => (
          <button
            key={code}
            onClick={() => setFilter(code)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === code ? "glow-btn border-transparent" : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {STATUS_DISPLAY[code]} ({counts[code] ?? 0})
          </button>
        ))}
      </div>

      {/* 주문 목록 */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl text-center py-16">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-muted-foreground text-sm">주문이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {filtered.map(order => {
              const flow = FLOW[order.status.code];
              const isExpanded = expanded === order.id;
              const isLoading = loadingId === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="glass rounded-xl overflow-hidden border border-[var(--glass-border)]"
                >
                  {/* 헤더 행 */}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* 회원 정보 */}
                    <Avatar user={order.user} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{order.user.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono bg-white/5 px-1.5 py-0.5 rounded">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLE[order.status.code]}`}>
                          {STATUS_DISPLAY[order.status.code]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {order.user.email}
                        {order.user.phone && ` · ${order.user.phone}`}
                      </p>
                    </div>

                    {/* 금액 + 날짜 */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-semibold">{order.totalPrice.toLocaleString("ko-KR")}원</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>

                    {/* 상태 진행 버튼 */}
                    {flow && (
                      <motion.button
                        onClick={() => handleAdvance(order)}
                        disabled={isLoading}
                        className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg glass border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-40"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isLoading ? (
                          <span className="w-3 h-3 border border-indigo-400/50 border-t-indigo-400 rounded-full animate-spin" />
                        ) : flow.icon}
                        <span className="hidden sm:inline">{flow.nextLabel}</span>
                      </motion.button>
                    )}
                    {!flow && (
                      <span className="shrink-0 text-xs text-emerald-400 font-medium px-2">✓ 완료</span>
                    )}

                    {/* 펼치기 토글 */}
                    <button
                      onClick={() => setExpanded(prev => prev === order.id ? null : order.id)}
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>

                  {/* 펼침 영역 */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
                          {/* 배송지 */}
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p><span className="text-gray-400">수령인:</span> {order.receiverName} · {order.receiverPhone}</p>
                            <p><span className="text-gray-400">주소:</span> {order.address}</p>
                            <p className="sm:hidden"><span className="text-gray-400">금액:</span> {order.totalPrice.toLocaleString("ko-KR")}원</p>
                          </div>

                          {/* 주문 상품 */}
                          <div className="space-y-2">
                            {order.orderItems.map(item => (
                              <div key={item.id} className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 shrink-0">
                                  {item.product.imageUrl ? (
                                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-base">📦</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.price.toLocaleString("ko-KR")}원 × {item.quantity}개
                                  </p>
                                </div>
                                <p className="text-sm font-semibold shrink-0">
                                  {(item.price * item.quantity).toLocaleString("ko-KR")}원
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* 상태 진행 바 */}
                          <div className="flex items-center gap-1 pt-1">
                            {(["PENDING", "PAID", "SHIPPING", "DONE"] as const).map((code, i, arr) => {
                              const orderIdx = arr.indexOf(order.status.code as any);
                              const stepIdx = i;
                              const done = stepIdx <= orderIdx;
                              return (
                                <div key={code} className="flex items-center gap-1 flex-1">
                                  <div className={`h-1.5 flex-1 rounded-full transition-colors ${done ? "bg-indigo-500" : "bg-white/10"}`} />
                                  {i === arr.length - 1 && (
                                    <div className={`w-2 h-2 rounded-full ${done ? "bg-indigo-500" : "bg-white/10"}`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
                            <span>결제대기</span>
                            <span>배달 준비</span>
                            <span>배달중</span>
                            <span>배달 완료</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
