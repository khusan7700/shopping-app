import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";
import { CartBadge } from "./CartBadge"; // ← 이 줄을 추가합니다

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          🛍️ ShopApp
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            상품 목록
          </Link>
          <CartBadge userId={session?.user?.id} />{" "}
          {/* 장바구니 배지를 여기에 추가합니다 */}
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              관리자
            </Link>
          )}
        </nav>

        {/* 인증 영역 */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-600">
                {session.user?.name} 님
              </span>
              <Link
                href="/mypage"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                마이페이지
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700"
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
