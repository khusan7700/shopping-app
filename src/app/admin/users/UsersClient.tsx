"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldOff, ShieldCheck, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  role: string;
  status: string;
  createdAt: string;
  orders: { address: string }[];
  _count: { orders: number };
}

function Avatar({ user }: { user: User }) {
  if (user.imageUrl) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
        <Image src={user.imageUrl} alt={user.name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300 font-bold text-sm">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}

export function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filter, setFilter] = useState<"all" | "active" | "blocked">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = users.filter(u =>
    filter === "all" ? true : u.status === filter
  );

  const handleStatus = async (id: string, status: "active" | "blocked") => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 회원을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  const activeCount = users.filter(u => u.status === "active").length;
  const blockedCount = users.filter(u => u.status === "blocked").length;

  return (
    <div>
      {/* 필터 탭 */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {([
          ["all", `전체 (${users.length})`],
          ["active", `활성 (${activeCount})`],
          ["blocked", `차단 (${blockedCount})`],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === val
                ? "glow-btn border-transparent"
                : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 모바일: 카드 */}
      <div className="flex flex-col gap-3 sm:hidden">
        <AnimatePresence initial={false}>
          {filtered.map(user => (
            <motion.div
              key={user.id}
              layout
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`glass rounded-xl p-4 border transition-colors ${
                user.status === "blocked" ? "border-red-500/25" : "border-[var(--glass-border)]"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar user={user} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{user.name}</span>
                    {user.role === "admin" && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">ADMIN</span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                      user.status === "blocked"
                        ? "bg-red-500/15 text-red-400 border-red-500/25"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    }`}>
                      {user.status === "blocked" ? "차단됨" : "활성"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                {user.phone && <p>📞 {user.phone}</p>}
                {user.orders[0]?.address && (
                  <p className="truncate">📍 {user.orders[0].address}</p>
                )}
                <p>주문 {user._count.orders}건</p>
              </div>
              <div className="flex gap-2 justify-end">
                {user.status === "active" ? (
                  <button
                    onClick={() => handleStatus(user.id, "blocked")}
                    disabled={loadingId === user.id}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg glass border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                  >
                    <ShieldOff size={11} /> 차단
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatus(user.id, "active")}
                    disabled={loadingId === user.id}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg glass border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
                  >
                    <ShieldCheck size={11} /> 활성화
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user.id, user.name)}
                  disabled={loadingId === user.id}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg glass border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={11} /> 삭제
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-sm">회원이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 데스크톱: 테이블 */}
      <div className="hidden sm:block glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr>
              {["회원", "연락처", "최근 주소", "주문", "상태", ""].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wide ${
                    i === 0 ? "text-left" :
                    i === 1 ? "text-left hidden md:table-cell" :
                    i === 2 ? "text-left hidden lg:table-cell" :
                    i === 3 ? "text-center w-16" :
                    i === 4 ? "text-center w-24" :
                    "text-center w-32"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {filtered.map(user => (
                <motion.tr
                  key={user.id}
                  layout
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`hover:bg-white/5 transition-colors ${
                    user.status === "blocked" ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{user.name}</span>
                          {user.role === "admin" && (
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">ADMIN</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-muted-foreground">{user.phone ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {user.orders[0]?.address ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-medium text-muted-foreground">{user._count.orders}건</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] px-2 py-1 rounded-full border font-medium ${
                      user.status === "blocked"
                        ? "bg-red-500/15 text-red-400 border-red-500/25"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    }`}>
                      {user.status === "blocked" ? "차단됨" : "활성"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {user.status === "active" ? (
                        <motion.button
                          onClick={() => handleStatus(user.id, "blocked")}
                          disabled={loadingId === user.id}
                          className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-40"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="차단"
                        >
                          <ShieldOff size={14} />
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => handleStatus(user.id, "active")}
                          disabled={loadingId === user.id}
                          className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-40"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="활성화"
                        >
                          <ShieldCheck size={14} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={loadingId === user.id}
                        className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-40"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-3xl mb-2">👥</p>
            <p>회원이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
