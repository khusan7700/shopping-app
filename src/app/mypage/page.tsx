import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProfileCard } from "@/components/mypage/ProfileCard";
import { OrderCard } from "@/components/mypage/OrderCard";
import { PageTransition } from "@/components/motion/PageTransition";
import { MotionDiv } from "@/components/motion/MotionDiv";

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, phone: true, description: true, imageUrl: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        status: true,
        orderItems: {
          include: { product: { select: { name: true, imageUrl: true } } },
        },
      },
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 프로필 카드 */}
      <ProfileCard user={{ ...user, createdAt: user.createdAt.toISOString() }} />

      {/* 주문 내역 */}
      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          주문 내역
          <span className="text-sm font-normal text-muted-foreground">({orders.length}건)</span>
        </h2>

        {orders.length === 0 ? (
          <div className="glass rounded-2xl text-center py-16">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-muted-foreground mb-4">아직 주문 내역이 없습니다</p>
            <a href="/products" className="glow-btn text-sm font-semibold px-5 py-2.5 rounded-xl inline-block">
              쇼핑하러 가기
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order as any} />
            ))}
          </div>
        )}
      </MotionDiv>
    </PageTransition>
  );
}
