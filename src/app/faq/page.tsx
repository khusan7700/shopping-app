import { prisma } from "@/lib/db";
import { FaqClient } from "./FaqClient";
import { PageTransition } from "@/components/motion/PageTransition";
import { MotionDiv } from "@/components/motion/MotionDiv";

export const metadata = { title: "FAQ — Vibe Shop" };

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  // category → faq[] map
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <PageTransition>
      {/* Hero */}
      <MotionDiv
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
          ✦ FAQ
        </p>
        <h1 className="text-3xl sm:text-4xl font-black gradient-text mb-3">자주 묻는 질문</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          궁금한 점이 있으신가요? 아래에서 빠르게 답을 찾아보세요.
        </p>
      </MotionDiv>

      <FaqClient grouped={grouped} />
    </PageTransition>
  );
}
