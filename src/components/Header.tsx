import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";
import { CartBadge } from "./CartBadge";

export async function Header() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-2">

        {/* 로고 */}
        <Link href="/" className="text-lg sm:text-xl font-bold text-gray-900 shrink-0">
          🛍️ ShopApp
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden sm:flex items-center gap-5">
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
            상품 목록
          </Link>
          <CartBadge userId={session?.user?.id} />
          {isAdmin && (
            <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              관리자
            </Link>
          )}
        </nav>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <>
              {/* 모바일: 이름 숨김, 장바구니 표시 */}
              <span className="hidden sm:inline text-sm text-gray-500">
                {session.user?.name} 님
              </span>

              {/* 모바일 장바구니 */}
              <span className="sm:hidden">
                <CartBadge userId={session?.user?.id} />
              </span>

              {/* 관리자 링크 — 모바일 */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="sm:hidden text-xs text-blue-600 font-medium border border-blue-200 px-2 py-1 rounded-md"
                >
                  관리자
                </Link>
              )}

              <Link
                href="/mypage"
                className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900"
              >
                마이페이지
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              {/* 모바일 장바구니 */}
              <span className="sm:hidden">
                <CartBadge userId={undefined} />
              </span>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-700"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
