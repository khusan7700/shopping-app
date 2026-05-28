import { prisma } from "@/lib/db";
import { ProductRegisterForm } from "@/components/admin/ProductRegisterForm";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import { PageTransition } from "@/components/motion/PageTransition";

export default async function AdminPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <PageTransition>
      {/* 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">상품 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            총 <span className="text-indigo-400 font-semibold">{products.length}</span>개 상품 등록됨
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href="/admin/faq"
            className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            FAQ 관리
          </a>
          <a
            href="/admin/orders"
            className="glass border border-yellow-500/30 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-yellow-400"
          >
            🚚 주문 관리
          </a>
          <a
            href="/admin/users"
            className="glass border border-emerald-500/30 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-emerald-400"
          >
            👥 회원 관리
          </a>
          <a
            href="/admin/messages"
            className="glass border border-indigo-500/30 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-indigo-400"
          >
            💬 문의 메시지
          </a>
          <ProductRegisterForm />
        </div>
      </div>

      <AdminProductsTable initialProducts={products} />
    </PageTransition>
  );
}
