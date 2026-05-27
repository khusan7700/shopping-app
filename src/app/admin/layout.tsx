import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// middleware.ts 가 1차로 막고,
// 이 layout 이 2차로 role 을 재확인한다 — 이중 보안 패턴
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          관리자 모드
        </p>
      </div>
      {children}
    </div>
  );
}
