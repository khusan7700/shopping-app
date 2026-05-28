"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "./NavLink";

interface MobileMenuProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName?: string | null;
  onSignOut: () => void;
}

export function MobileMenu({ isLoggedIn, isAdmin, userName, onSignOut }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Hamburger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-xl glass flex flex-col items-center justify-center gap-1.5 sm:hidden"
        whileTap={{ scale: 0.9 }}
        aria-label="메뉴"
      >
        <motion.span
          animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="block w-4 h-0.5 bg-foreground rounded-full origin-center transition-all"
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          className="block w-4 h-0.5 bg-foreground rounded-full"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="block w-4 h-0.5 bg-foreground rounded-full origin-center"
        />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-72 z-50 glass-strong flex flex-col sm:hidden shadow-2xl"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--glass-border)]">
              <span className="font-bold gradient-text text-base">메뉴</span>
              <button onClick={close} className="text-muted-foreground hover:text-foreground text-xl leading-none">✕</button>
            </div>

            {/* User info */}
            {isLoggedIn && userName && (
              <div className="px-6 py-4 border-b border-[var(--glass-border)]">
                <p className="text-xs text-muted-foreground">안녕하세요</p>
                <p className="font-semibold text-sm mt-0.5">{userName} 님</p>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {[
                { href: "/", label: "홈", exact: true },
                { href: "/products", label: "상품 목록" },
                { href: "/faq", label: "FAQ" },
                { href: "/cart", label: "장바구니 🛒" },
                ...(isLoggedIn ? [{ href: "/mypage", label: "마이페이지" }] : []),
                ...(isAdmin ? [{ href: "/admin", label: "⚙ 관리자" }] : []),
              ].map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  exact={item.exact}
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--glass-bg)] text-sm w-full"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="px-4 py-4 border-t border-[var(--glass-border)] space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={() => { close(); onSignOut(); }}
                  className="w-full text-sm text-red-400 border border-red-400/20 hover:border-red-400/40 py-2.5 rounded-xl transition-colors"
                >
                  로그아웃
                </button>
              ) : (
                <div className="flex gap-2">
                  <NavLink href="/login" onClick={close} className="flex-1 text-center py-2.5 rounded-xl glass text-sm">
                    로그인
                  </NavLink>
                  <NavLink href="/register" onClick={close} className="flex-1 text-center py-2.5 rounded-xl glow-btn text-sm font-semibold">
                    회원가입
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
