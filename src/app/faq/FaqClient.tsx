"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FaqClientProps {
  grouped: Record<string, Faq[]>;
}

const CATEGORY_ICON: Record<string, string> = {
  "배송": "🚚",
  "주문·결제": "💳",
  "반품·교환": "🔄",
  "계정": "👤",
  "상품": "👕",
  "일반": "💬",
};

function FaqItem({ faq, index }: { faq: Faq; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
        open ? "ring-1 ring-indigo-500/30" : ""
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left"
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-sm font-bold"
        >
          +
        </motion.span>
        <span className={`font-medium text-sm leading-relaxed ${open ? "gradient-text" : ""}`}>
          {faq.question}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 ml-10 border-t border-[var(--glass-border)] pt-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqClient({ grouped }: FaqClientProps) {
  const categories = Object.keys(grouped);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const filteredGrouped = (() => {
    if (!search.trim() && !activeCategory) return grouped;
    const result: Record<string, Faq[]> = {};
    for (const [cat, faqs] of Object.entries(grouped)) {
      if (activeCategory && cat !== activeCategory) continue;
      const filtered = search
        ? faqs.filter(
            (f) =>
              f.question.toLowerCase().includes(search.toLowerCase()) ||
              f.answer.toLowerCase().includes(search.toLowerCase())
          )
        : faqs;
      if (filtered.length > 0) result[cat] = filtered;
    }
    return result;
  })();

  const totalVisible = Object.values(filteredGrouped).flat().length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="궁금한 내용을 검색해보세요..."
          className="w-full glass-strong rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-muted-foreground"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
          >
            ✕
          </button>
        )}
      </motion.div>

      {/* Category tabs */}
      <motion.div
        className="flex gap-2 flex-wrap mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
            !activeCategory
              ? "glow-btn border-transparent"
              : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
          }`}
        >
          전체
        </button>
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === cat
                ? "glow-btn border-transparent"
                : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {CATEGORY_ICON[cat] ?? "💬"} {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Results count when searching */}
      {search && (
        <motion.p
          className="text-xs text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          &quot;{search}&quot; 검색 결과: {totalVisible}개
        </motion.p>
      )}

      {/* FAQ Accordion by category */}
      {totalVisible === 0 ? (
        <motion.div
          className="text-center py-16 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm">검색 결과가 없습니다.</p>
        </motion.div>
      ) : (
        Object.entries(filteredGrouped).map(([category, faqs], catIdx) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.08 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">{CATEGORY_ICON[category] ?? "💬"}</span>
              <h2 className="font-bold text-sm">{category}</h2>
              <span className="text-xs text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full">
                {faqs.length}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FaqItem key={faq.id} faq={faq} index={i} />
              ))}
            </div>
          </motion.section>
        ))
      )}

      {/* Contact CTA */}
      <motion.div
        className="glass-strong rounded-2xl p-6 text-center mt-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-2xl mb-2">🙋</p>
        <p className="font-semibold text-sm mb-1">원하는 답을 찾지 못하셨나요?</p>
        <p className="text-xs text-muted-foreground mb-4">
          고객센터로 문의주시면 빠르게 도움을 드리겠습니다.
        </p>
        <a
          href="mailto:support@vibeshop.com"
          className="glow-btn inline-block text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
        >
          고객센터 문의하기 →
        </a>
      </motion.div>
    </div>
  );
}
