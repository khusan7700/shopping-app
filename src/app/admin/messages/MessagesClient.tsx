"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Mail, MailOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

function timeStr(dateStr: string) {
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = messages.filter(m =>
    filter === "all" ? true : filter === "unread" ? !m.isRead : m.isRead
  );

  const handleRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 메시지를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages(prev => prev.filter(m => m.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  const markAllRead = async () => {
    const unread = messages.filter(m => !m.isRead);
    await Promise.all(unread.map(m => fetch(`/api/admin/messages/${m.id}`, { method: "PATCH" })));
    setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
  };

  return (
    <div>
      {/* 필터 + 일괄 읽음 */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(["all", "unread", "read"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === f ? "glow-btn border-transparent" : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? `전체 (${messages.length})` : f === "unread" ? `미읽음 (${unreadCount})` : `읽음 (${messages.length - unreadCount})`}
          </button>
        ))}
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            <Check size={12} /> 전체 읽음 처리
          </button>
        )}
      </div>

      {/* 메시지 목록 */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl text-center py-16">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-muted-foreground text-sm">메시지가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {filtered.map(msg => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className={`glass rounded-xl overflow-hidden border transition-colors ${
                  !msg.isRead ? "border-indigo-500/30" : "border-[var(--glass-border)]"
                }`}
              >
                {/* 헤더 */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/5 transition-colors"
                  onClick={() => {
                    setExpanded(prev => prev === msg.id ? null : msg.id);
                    if (!msg.isRead) handleRead(msg.id);
                  }}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    !msg.isRead ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-muted-foreground"
                  }`}>
                    {msg.isRead ? <MailOpen size={15} /> : <Mail size={15} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{msg.name}</span>
                      {!msg.isRead && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full font-medium">NEW</span>
                      )}
                      {msg.user && (
                        <span className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full">
                          회원: {msg.user.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {msg.phone}  {msg.email && `· ${msg.email}`}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-muted-foreground">{timeStr(msg.createdAt)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{msg.id.slice(0, 8)}</p>
                  </div>
                </button>

                {/* 본문 (확장 시) */}
                <AnimatePresence>
                  {expanded === msg.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-white/5">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-3">
                          {msg.message}
                        </p>
                        <div className="flex justify-end gap-2 mt-3">
                          <a
                            href={`tel:${msg.phone}`}
                            className="glass border border-[var(--glass-border)] text-xs px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          >
                            📞 전화
                          </a>
                          <a
                            href={`sms:${msg.phone.replace(/-/g, "")}`}
                            className="glass border border-indigo-500/25 text-xs px-3 py-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            💬 SMS 답장
                          </a>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="glass border border-red-500/25 text-xs px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={11} /> 삭제
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
