"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LikeButtonProps {
  productId: string;
  isLoggedIn: boolean;
}

export function LikeButton({ productId, isLoggedIn }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${productId}/like`)
      .then((r) => r.json())
      .then((data) => {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
        setLikeId(data.likeId);
      });
  }, [productId]);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }
    if (loading) return;
    setLoading(true);

    // optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    if (!wasLiked) setParticles(true);

    try {
      const res = await fetch(`/api/products/${productId}/like`, { method: "POST" });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      setLikeId(data.likeId);
    } catch {
      // rollback on error
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setLoading(false);
      setTimeout(() => setParticles(false), 600);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={handleToggle}
        disabled={loading}
        className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
          liked
            ? "bg-red-500/15 border-red-500/40 text-red-400"
            : "glass border-[var(--glass-border)] text-muted-foreground hover:text-foreground"
        }`}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.93 }}
      >
        {/* Particle burst on like */}
        <AnimatePresence>
          {particles &&
            [...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 28,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 28,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute w-1.5 h-1.5 rounded-full bg-red-400 pointer-events-none"
              />
            ))}
        </AnimatePresence>

        {/* Heart icon */}
        <motion.svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={liked ? 0 : 2}
            transition={{ duration: 0.2 }}
          />
        </motion.svg>

        <span>
          {liked ? "좋아요 취소" : "좋아요"}
        </span>
      </motion.button>

      {/* Count + Like ID chip */}
      <div className="flex flex-col gap-1">
        <motion.div
          key={likeCount}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5"
        >
          <span className="text-red-400 text-sm">♥</span>
          <span className="font-bold text-sm">{likeCount.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">명이 좋아해요</span>
        </motion.div>

        <AnimatePresence>
          {likeId && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1"
            >
              <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Like ID</span>
              <span className="text-[10px] font-mono bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 px-2 py-0.5 rounded-md">
                {likeId.slice(0, 12)}…
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
