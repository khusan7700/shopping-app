"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "홈", href: "/" },
  { label: "상품 목록", href: "/products" },
  { label: "FAQ", href: "/faq" },
  { label: "장바구니", href: "/cart" },
  { label: "마이페이지", href: "/mypage" },
];

const LEGAL_LINKS = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#" },
  { label: "고객센터", href: "#" },
];

const PHONE = "010-7730-7215";
const EMAIL = "khusan7700@gmail.com";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 glow-btn rounded-2xl flex items-center justify-center shadow-xl"
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{ scale: 0.93 }}
          aria-label="맨 위로"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSend = async () => {
    if (!form.name || !form.phone || !form.message) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setDone(true);
      // 실제 SMS 앱도 열기
      window.location.href = `sms:${PHONE.replace(/-/g, "")}`;
      setTimeout(onClose, 2000);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm"
      >
        {done ? (
          <div className="text-center py-4">
            <p className="text-3xl mb-2">✅</p>
            <p className="font-semibold">메시지가 전송되었습니다!</p>
            <p className="text-xs text-muted-foreground mt-1">SMS 앱이 열립니다.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">문의 메시지 보내기</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">✕</button>
            </div>
            <div className="space-y-3">
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="이름"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
              <input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="전화번호"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="문의 내용을 입력해주세요..."
                rows={3}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
            <motion.button
              onClick={handleSend}
              disabled={sending || !form.name || !form.phone || !form.message}
              className="w-full mt-4 glow-btn py-3 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.97 }}
            >
              {sending ? "전송 중..." : "💬 메시지 전송"}
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showModal && <ContactModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
      <ScrollToTopButton />

      <motion.footer
        className="mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛍️</span>
                <span className="font-black gradient-text text-lg tracking-tight">VIBE shop</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                트렌드를 입다. 엄선된 프리미엄 상품을 합리적인 가격에.
              </p>

              {/* Contact */}
              <div className="space-y-1.5 pt-1">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="w-6 h-6 glass rounded-lg flex items-center justify-center text-[11px] group-hover:scale-110 transition-transform">📞</span>
                  {PHONE}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="w-6 h-6 glass rounded-lg flex items-center justify-center text-[11px] group-hover:scale-110 transition-transform">✉️</span>
                  {EMAIL}
                </a>
              </div>

                      {/* SMS button */}
              <motion.button
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 glass border border-indigo-500/25 hover:border-indigo-500/50 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors mt-1"
              >
                <span>💬</span>
                문자 보내기
              </motion.button>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                메뉴
              </p>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block transition-transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                정책
              </p>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 inline-block duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <span>© 2024 Vibe Shop. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Made with <span className="text-red-400">♥</span> by Khusan
            </span>
          </div>
        </div>
      </motion.footer>
    </>
  );
}
