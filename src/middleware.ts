// auth.config.ts만 import: DB 접근 코드가 없어 Edge Runtime에서도 실행 가능
import NextAuth from "next-auth"; // NextAuth 라이브러리에서 인증 인스턴스 생성 함수를 가져온다
import { authConfig } from "@/lib/auth.config"; // authorized 콜백 등 인증 공통 설정을 가져온다

export default NextAuth(authConfig).auth; // authConfig로 NextAuth 인스턴스를 만들고, 그 안의 auth 미들웨어 함수(NextAuth 반환)를 기본 export한다. auth에는 사용자의 인증 세션 검사 로직이 담겨 있다. 이 미들웨어는 Edge Runtime에서 실행되며, 인증이 필요한 페이지에 접근할 때마다 사용자의 세션을 검사하여 인증 여부에 따라 접근을 허용하거나 로그인 페이지로 리다이렉트한다.

export const config = {
  // 부정 전방탐색(?!)으로 아래 경로를 제외한 모든 경로에서 미들웨어를 실행한다
  // 제외 대상: api(API Route), _next/static(JS·CSS 번들), _next/image(이미지 최적화), favicon.ico
  // 여기에 포함되지 않은 모든 경로는 인증이 필요한 페이지이므로, 사용자의 세션을 검사하여 인증 여부에 따라 접근을 허용하거나 로그인 페이지로 리다이렉트한다
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
