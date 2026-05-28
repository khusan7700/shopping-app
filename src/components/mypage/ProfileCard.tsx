"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X, Check, Camera } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export function ProfileCard({ user }: { user: UserProfile }) {
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone ?? "",
    description: user.description ?? "",
    imageUrl: user.imageUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/mypage/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "저장 실패"); return; }
      setProfile({ ...profile, ...data });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.name.slice(0, 2).toUpperCase();
  const joinDate = new Date(profile.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <motion.div
      className="glass rounded-2xl p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        {/* 아바타 */}
        <div className="relative shrink-0">
          {profile.imageUrl ? (
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-indigo-500/30">
              <Image src={profile.imageUrl} alt={profile.name} width={80} height={80} className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
              {initials}
            </div>
          )}
          {editing && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Camera size={12} className="text-white" />
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">이름</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                    placeholder="이름"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">전화번호</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">프로필 이미지 URL</label>
                <input
                  value={form.imageUrl}
                  onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">자기소개</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  maxLength={200}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  placeholder="간단한 자기소개를 입력하세요..."
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-2">
                <motion.button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 glow-btn px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  <Check size={14} /> {saving ? "저장 중..." : "저장"}
                </motion.button>
                <motion.button
                  onClick={() => { setEditing(false); setError(""); }}
                  className="flex items-center gap-1.5 glass border border-[var(--glass-border)] px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={14} /> 취소
                </motion.button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <motion.button
                  onClick={() => setEditing(true)}
                  className="shrink-0 glass border border-[var(--glass-border)] p-2 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  title="프로필 수정"
                >
                  <Pencil size={14} className="text-muted-foreground" />
                </motion.button>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {profile.phone && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span className="text-xs">📞</span> {profile.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className="text-xs">📅</span> {joinDate} 가입
                </span>
              </div>

              <AnimatePresence>
                {profile.description && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 text-sm text-muted-foreground leading-relaxed border-l-2 border-indigo-500/30 pl-3"
                  >
                    {profile.description}
                  </motion.p>
                )}
              </AnimatePresence>

              {!profile.phone && !profile.description && (
                <p className="mt-2 text-xs text-muted-foreground/60 italic">
                  ✏️ 프로필을 수정해서 전화번호와 자기소개를 추가해보세요
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
