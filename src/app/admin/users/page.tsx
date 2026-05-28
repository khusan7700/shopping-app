import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      imageUrl: true,
      role: true,
      status: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { address: true },
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  const activeCount = users.filter(u => u.status === "active").length;
  const blockedCount = users.filter(u => u.status === "blocked").length;

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">회원 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            총 <span className="text-indigo-400 font-semibold">{users.length}</span>명
            {blockedCount > 0 && (
              <> · 차단 <span className="text-red-400 font-semibold">{blockedCount}</span>명</>
            )}
            · 활성 <span className="text-emerald-400 font-semibold">{activeCount}</span>명
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/admin" className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            ← 상품 관리
          </a>
          <a href="/admin/messages" className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            💬 문의 메시지
          </a>
          <a href="/admin/faq" className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            FAQ 관리
          </a>
        </div>
      </div>

      <UsersClient initialUsers={users as any} />
    </PageTransition>
  );
}
