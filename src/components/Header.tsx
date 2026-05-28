import { auth } from "@/lib/auth";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { MotionDiv } from "./motion/MotionDiv";

export async function Header() {
  const session = await auth();
  const user = session?.user as any;
  const isAdmin = user?.role === "admin";

  return (
    <MotionDiv
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <header className="glass border-b border-[var(--glass-border)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Logo />
          <NavBar
            isLoggedIn={!!session}
            isAdmin={isAdmin}
            userId={user?.id}
            userName={user?.name}
          />
        </div>
      </header>
    </MotionDiv>
  );
}
