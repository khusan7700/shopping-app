"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderCompletePage() {
  return (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.p
        className="text-6xl mb-6"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.15 }}
      >
        🎉
      </motion.p>

      <motion.h1
        className="text-2xl font-bold mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        주문이 완료되었습니다!
      </motion.h1>

      <motion.p
        className="text-gray-400 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.48 }}
      >
        주문 내역은 마이페이지에서 확인할 수 있습니다.
      </motion.p>

      <motion.div
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58 }}
      >
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/mypage"
            className="px-6 py-3 bg-white text-[#160E4E] font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            주문 내역 보기
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/products"
            className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
