import type { NextAuthConfig } from "next-auth";

/**
 * [auth.config.ts] Edge Runtime(미들웨어)과 Node.js 서버 양쪽에서 공유하는 "가벼운" 인증 공통 설정.
 * DB 접근이 없어 어디서든 실행 가능 → middleware.ts가 이 파일만 import해서 라우트를 보호한다.
 */
/**
 * NextAuth 설정 객체
 * - pages: 커스텀 로그인 페이지 경로 설정, 이 설정 없으면 NextAuth 기본 로그인 페이지가 뜸. 로그인 페이지는 인증이 필요한 페이지에 비정상적으로 접근했을 때 자동으로 리다이렉트되는 페이지이기도 함
 * - providers: 인증 공급자 설정 (auth.ts에서 추가 예정)
 */
const protectedRoutes = ["/mypage"];
const adminRoutes = ["/admin"];

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    // Edge Runtime(미들웨어)에서도 role 을 session 에 복원한다
    session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;
      const pathname = nextUrl.pathname;

      // 1. 관리자 경로 접근 시도
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== "admin")
          return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      // 2. 일반 보호 경로 접근 시도
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isProtectedRoute && !isLoggedIn) return false;

      // 3. 그 외 경로는 통과
      return true;
    },
  },
  providers: [],
};
