import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { OrdersClient } from "./OrdersClient";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      status: true,
      user: {
        select: { id: true, name: true, email: true, phone: true, imageUrl: true },
      },
      orderItems: {
        include: {
          product: { select: { id: true, name: true, imageUrl: true, price: true } },
        },
      },
    },
  });

  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status.code === "PENDING").length,
    paid: orders.filter(o => o.status.code === "PAID").length,
    shipping: orders.filter(o => o.status.code === "SHIPPING").length,
    done: orders.filter(o => o.status.code === "DONE").length,
  };

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">주문 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            총 <span className="text-indigo-400 font-semibold">{counts.total}</span>건
            {counts.shipping > 0 && (
              <> · 배달중 <span className="text-indigo-400 font-semibold">{counts.shipping}</span>건</>
            )}
            {counts.paid > 0 && (
              <> · 배달 준비 <span className="text-yellow-400 font-semibold">{counts.paid}</span>건</>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/admin" className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            ← 상품 관리
          </a>
          <a href="/admin/users" className="glass border border-emerald-500/30 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-emerald-400">
            👥 회원 관리
          </a>
          <a href="/admin/messages" className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            💬 문의
          </a>
        </div>
      </div>

      <OrdersClient initialOrders={orders as any} />
    </PageTransition>
  );
}
