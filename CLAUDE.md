# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚨 AI 버전 통제 정책 — 반드시 준수

아래 버전을 **정확히 고정**하여 코드 작성 및 패키지 설치를 진행한다. `latest` 사용 금지. 버전 변경이 필요한 경우 사용자(강사)에게 사유를 설명하고 명시적 승인을 받아야 한다.

| 기술 | 고정 버전 | 역할 |
|---|---|---|
| Next.js (App Router) | `16.2.6` | 풀스택 프레임워크 |
| React | `19.2.4` | UI 라이브러리 |
| Prisma | `7.8.0` | ORM |
| PostgreSQL (`pg`) | `^8.21.0` | DB 드라이버 |
| NextAuth.js | `^5.0.0-beta.31` | 인증/인가 (Auth.js) |
| Zustand | `^5.0.13` | 클라이언트 전역 상태 |
| TailwindCSS | `^4.0.0` | 스타일링 |
| Shadcn UI | `^4.7.0` | 컴포넌트 라이브러리 |
| React Hook Form | `^7.76.0` | 폼 상태 관리 |
| Zod | `^4.4.3` | 스키마 검증 |
| TanStack Query | `^5.100.11` | 서버 상태 관리 |
| bcryptjs | `^3.0.3` | 비밀번호 해싱 |
| lucide-react | `^1.16.0` | 아이콘 |
| @hookform/resolvers | `^5.2.2` | RHF ↔ Zod 연결 |

---

## Commands

```bash
npm run dev                          # 개발 서버 실행
npx prisma migrate dev --name init   # DB 스키마 동기화 + 마이그레이션
npx prisma studio                    # DB 데이터 GUI 관리
npx prisma db seed                   # 초기 더미 데이터 삽입
```

---

## 아키텍처 핵심 규칙

### 인증/인가 — 3파일 역할 분담 (변경 금지 구조)

```
lib/auth.ts        ← Node.js 전용. Prisma로 DB 조회, bcrypt 검증, JWT/세션 콜백
lib/auth.config.ts ← Edge + Node.js 공용. protectedRoutes/adminRoutes 배열, authorized 콜백
middleware.ts      ← Edge Runtime. auth.config.ts만 import (Prisma 사용 불가)
```

- `middleware.ts`에서 Prisma 또는 `lib/auth.ts`를 직접 import하면 Edge Runtime 오류 발생
- JWT 콜백에서 `token.role`에 저장 → session 콜백에서 `session.user.role`로 전달
- 새 보호 경로 추가 시 `auth.config.ts`의 `protectedRoutes` 또는 `adminRoutes` 배열에 추가

### 상태 관리 — 4분류 원칙

| 데이터 성격 | 도구 | 예시 |
|---|---|---|
| 서버 데이터 읽기 | TanStack Query (`useQuery`) | 상품 목록, 주문 내역 |
| 클라이언트 전역 | Zustand + `persist` | 장바구니 (`cartStore`) |
| 폼 입력 | React Hook Form + Zod `resolver` | 배송지, 로그인, 상품 등록 |
| 컴포넌트 로컬 | `useState` | 모달 토글, UI 상태 |

### Server Component vs Client Component 분리 패턴

- 페이지(`page.tsx`)는 기본 Server Component — `await auth()`, `await prisma.*` 직접 호출
- 이벤트 핸들러·훅이 필요한 부분만 `"use client"` 컴포넌트로 분리 (예: `AddToCartButton`, `SignOutButton`, `CartBadge`)
- `QueryProvider`, Zustand 스토어 사용 컴포넌트는 반드시 Client Component

### API Route 패턴 (`app/api/**/route.ts`)

```ts
// 세션 확인 → Zod 검증 → Prisma 작업 순서를 반드시 지킨다
const session = await auth();
if (!session?.user?.id) return NextResponse.json({ error: "..." }, { status: 401 });

const parsed = schema.safeParse(body);
if (!parsed.success) return NextResponse.json({ error: "..." }, { status: 400 });
```

- 주문처럼 여러 테이블을 동시에 쓰는 작업은 반드시 `prisma.$transaction()` 사용
- 관리자 전용 API는 `app/api/admin/` 하위에 배치하고 `session.user.role !== "admin"` 체크

### Prisma 싱글톤 (`lib/db.ts`)

개발 서버 핫 리로드 시 커넥션 폭발 방지를 위해 `global` 객체에 인스턴스를 저장. 이 패턴을 변경하지 않는다.

### Zod 스키마 위치

- `schemas/auth.schema.ts` — 로그인/회원가입
- `schemas/order.schema.ts` — 주문 배송지
- `schemas/product.schema.ts` — 상품 등록 (신규 생성 필요 시)

폼과 API 양쪽에서 동일 스키마를 재사용한다.

---

## 라우트 보호 규칙

```
/                → 공개
/products/**     → 공개
/cart            → 공개
/checkout        → 로그인 필수
/mypage/**       → 로그인 필수
/admin/**        → role: 'admin' 전용 (비로그인 → false, 일반유저 → redirect('/'))
```

admin 페이지는 middleware + `app/admin/layout.tsx` 이중 권한 체크 구조를 사용한다.

---

## 진행 현황 추적

- 작업 진척도: `docs/WORK.md` (10일 커리큘럼 마일스톤)
- 완료 이력: `docs/HISTORY.md`
- 구조 가이드: `docs/ARCHITECTURE.md`
- 기획 문서: `docs/PRD (1).md`
