import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MotionDiv } from "@/components/motion/MotionDiv";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/");
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
          ⚙ 관리자 모드
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent" />
      </div>
      {children}
    </MotionDiv>
  );
}
