"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

interface FormState {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY: FormState = { question: "", answer: "", category: "일반", sortOrder: 0, isActive: true };

const inputCls = "w-full glass rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-muted-foreground";
const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5";

export function AdminFaqClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const reset = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const handleEdit = (faq: Faq) => {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, sortOrder: faq.sortOrder, isActive: faq.isActive });
    setEditId(faq.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        const res = await fetch(`/api/admin/faq/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setFaqs((prev) => prev.map((f) => (f.id === editId ? updated : f)));
      } else {
        const res = await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setFaqs((prev) => [...prev, created]);
      }
      reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 FAQ를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleToggleActive = async (faq: Faq) => {
    const res = await fetch(`/api/admin/faq/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !faq.isActive }),
    });
    const updated = await res.json();
    setFaqs((prev) => prev.map((f) => (f.id === faq.id ? updated : f)));
  };

  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <div className="space-y-6">
      {/* Add button */}
      <div className="flex justify-end">
        <motion.button
          onClick={() => { reset(); setShowForm((v) => !v); }}
          className="glow-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {showForm && !editId ? "✕ 취소" : "+ FAQ 추가"}
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-strong rounded-2xl p-6 space-y-4 overflow-hidden"
          >
            <h2 className="font-semibold gradient-text text-sm">
              {editId ? "FAQ 수정" : "새 FAQ 등록"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>카테고리</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="예) 배송, 주문·결제"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>정렬 순서</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: +e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>질문 <span className="text-red-400">*</span></label>
              <input
                required
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="사용자가 자주 묻는 질문을 입력하세요"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>답변 <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={4}
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                placeholder="명확하고 친절한 답변을 작성하세요"
                className={inputCls + " resize-none"}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm text-muted-foreground">공개 여부</label>
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={reset} className="text-sm px-4 py-2 glass rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                취소
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                className="glow-btn text-white text-sm font-semibold px-5 py-2 rounded-xl disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? "저장 중..." : editId ? "수정 완료" : "등록하기"}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FAQ list grouped by category */}
      {categories.map((cat) => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold">{cat}</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="space-y-2">
            {faqs.filter((f) => f.category === cat).map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass rounded-2xl overflow-hidden ${!faq.isActive ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium leading-snug">{faq.question}</p>
                    <AnimatePresence>
                      {expandedId === faq.id && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-xs text-muted-foreground mt-2 leading-relaxed overflow-hidden"
                        >
                          {faq.answer}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleActive(faq)}
                      title={faq.isActive ? "비공개로 전환" : "공개로 전환"}
                      className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                        faq.isActive
                          ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                          : "border-gray-500/30 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {faq.isActive ? "공개" : "비공개"}
                    </button>
                    <button
                      onClick={() => handleEdit(faq)}
                      className="text-xs px-2 py-1 rounded-lg border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="text-xs px-2 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
