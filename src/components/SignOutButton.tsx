"use client";

import { signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export function SignOutButton() {
  const handleSignOut = () => {
    // localStorage만 삭제 (DB는 건드리지 않음!)
    // → 다음에 같은 계정으로 로그인하면 DB에서 장바구니가 복원됨
    useCartStore.persist.clearStorage();
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-red-500 hover:text-red-700"
    >
      로그아웃
    </button>
  );
}
