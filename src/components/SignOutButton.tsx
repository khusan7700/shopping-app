"use client";

import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export function SignOutButton() {
  const handleSignOut = () => {
    useCartStore.persist.clearStorage();
    signOut({ callbackUrl: "/" });
  };

  return (
    <motion.button
      onClick={handleSignOut}
      className="text-sm text-red-400/80 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 px-3 py-1 rounded-lg transition-colors"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
    >
      로그아웃
    </motion.button>
  );
}
