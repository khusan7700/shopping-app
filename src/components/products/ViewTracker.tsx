"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ViewTrackerProps {
  productId: string;
}

export function ViewTracker({ productId }: ViewTrackerProps) {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    // 페이지 진입 시 조회수 기록 + 최신 카운트 반환
    fetch(`/api/products/${productId}/view`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setViewCount(data.viewCount));
  }, [productId]);

  if (viewCount === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>조회 {viewCount.toLocaleString()}회</span>
    </motion.div>
  );
}
