import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { MessagesClient } from "./MessagesClient";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") redirect("/");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">문의 메시지</h1>
          <p className="text-sm text-muted-foreground mt-1">
            총 <span className="text-indigo-400 font-semibold">{messages.length}</span>개
            {unreadCount > 0 && (
              <> · 미읽음 <span className="text-red-400 font-semibold">{unreadCount}</span>개</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/admin" className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            ← 상품 관리
          </a>
          <a href="/admin/faq" className="glass border border-[var(--glass-border)] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            FAQ 관리
          </a>
        </div>
      </div>

      <MessagesClient initialMessages={messages as any} />
    </PageTransition>
  );
}
