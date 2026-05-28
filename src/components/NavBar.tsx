"use client";

import { signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { CartBadge } from "./CartBadge";
import { NotificationBell } from "./NotificationBell";
import { MobileMenu } from "./MobileMenu";

interface NavBarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId?: string;
  userName?: string | null;
}

export function NavBar({ isLoggedIn, isAdmin, userId, userName }: NavBarProps) {
  const handleSignOut = () => {
    useCartStore.persist.clearStorage();
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-6">
        <NavLink href="/" exact>홈</NavLink>
        <NavLink href="/products">상품 목록</NavLink>
        <NavLink href="/faq">FAQ</NavLink>
        {isLoggedIn && <NavLink href="/mypage">마이페이지</NavLink>}
        {isAdmin && <NavLink href="/admin">관리자</NavLink>}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {isLoggedIn && <NotificationBell />}
        <CartBadge userId={userId} iconOnly />
        <ThemeToggle />

        {/* Desktop auth */}
        <div className="hidden sm:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="text-xs text-muted-foreground">{userName}</span>
              <button
                onClick={handleSignOut}
                className="text-xs text-red-400/80 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login" className="text-sm">로그인</NavLink>
              <NavLink href="/register" className="glow-btn text-sm px-3 py-1.5 rounded-xl font-semibold">
                회원가입
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <MobileMenu
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          userName={userName}
          onSignOut={handleSignOut}
        />
      </div>
    </div>
  );
}
