"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Pencil, Trash2, X, Check } from "lucide-react";

interface CommentUser {
  id: string;
  name: string;
  phone: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
}

interface ProductCommentsProps {
  productId: string;
  initialComments: Comment[];
  currentUserId?: string;
}

function maskPhone(phone: string | null) {
  if (!phone) return null;
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

export function ProductComments({ productId, initialComments, currentUserId }: ProductCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.status === 401) {
        alert("댓글을 작성하려면 로그인이 필요합니다.");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "오류가 발생했습니다.");
        return;
      }
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const submitEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`/api/products/${productId}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "수정 실패");
        return;
      }
      const updated = await res.json();
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
    } catch {
      alert("오류가 발생했습니다.");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/products/${productId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "삭제 실패");
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare size={18} className="text-indigo-400" />
        <h2 className="text-lg font-bold">댓글</h2>
        <span className="text-xs text-muted-foreground ml-1">({comments.length})</span>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="glass rounded-xl p-3 flex gap-2 items-end">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={currentUserId ? "댓글을 입력하세요..." : "댓글을 작성하려면 로그인하세요."}
            disabled={!currentUserId || submitting}
            rows={2}
            maxLength={500}
            className="flex-1 bg-transparent resize-none text-sm placeholder-muted-foreground focus:outline-none disabled:opacity-50"
          />
          <motion.button
            type="submit"
            disabled={!currentUserId || !content.trim() || submitting}
            className="glow-btn px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            whileTap={{ scale: 0.94 }}
          >
            <Send size={13} />
            {submitting ? "작성 중..." : "등록"}
          </motion.button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 text-right">{content.length}/500</p>
      </form>

      {/* Comment list */}
      <AnimatePresence initial={false}>
        {comments.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground text-center py-8"
          >
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </motion.p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-xl p-4 mb-3 group"
            >
              {/* User info row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{comment.user.name}</span>
                  {maskPhone(comment.user.phone) && (
                    <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                      {maskPhone(comment.user.phone)}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-mono bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                    ID: {comment.id.slice(0, 8)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                  {comment.user.id === currentUserId && editingId !== comment.id && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={() => startEdit(comment)}
                        className="w-6 h-6 rounded-md glass-strong flex items-center justify-center text-muted-foreground hover:text-indigo-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="수정"
                      >
                        <Pencil size={11} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="w-6 h-6 rounded-md glass-strong flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="삭제"
                      >
                        <Trash2 size={11} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content / Edit mode */}
              {editingId === comment.id ? (
                <div className="mt-1">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    maxLength={500}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-1.5">
                    <motion.button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg glass"
                      whileTap={{ scale: 0.94 }}
                    >
                      <X size={11} /> 취소
                    </motion.button>
                    <motion.button
                      onClick={() => submitEdit(comment.id)}
                      className="flex items-center gap-1 text-xs glow-btn px-3 py-1 rounded-lg"
                      whileTap={{ scale: 0.94 }}
                    >
                      <Check size={11} /> 저장
                    </motion.button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              )}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </section>
  );
}
