import { prisma } from "@/lib/db";
import { AdminFaqClient } from "./AdminFaqClient";
import { PageTransition } from "@/components/motion/PageTransition";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-xl font-bold gradient-text">FAQ 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">
          총 <span className="text-indigo-400 font-semibold">{faqs.length}</span>개 FAQ
        </p>
      </div>
      <AdminFaqClient initialFaqs={faqs} />
    </PageTransition>
  );
}
