# ARCHITECTURE.md — next-shopping-app 프로젝트 구조 가이드

**대상**: 수업에 참여하는 학생
**목적**: "왜 이 파일이 여기에 있는가"를 이해하고, 새 파일을 만들 때 어디에 두어야 할지 스스로 판단할 수 있도록 한다.

---

## 1. 전체 폴더 구조

```
next-shopping-app/
├── prisma/
│   ├── schema.prisma         # DB 테이블 정의 (엔티티, 관계)
│   └── seed.ts               # 초기 데이터 삽입 스크립트
│
├── src/
│   ├── app/                  # Next.js App Router — 페이지 & API
│   │   ├── layout.tsx        # 전체 앱 공통 레이아웃 (폰트, Provider 등)
│   │   ├── page.tsx          # 메인 홈 페이지 (/)
│   │   ├── globals.css       # 전역 스타일 (Tailwind base)
│   │   │
│   │   ├── (auth)/           # 라우트 그룹 — 인증 페이지
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── products/         # 상품 관련 페이지
│   │   │   ├── page.tsx          # 상품 목록 (/products)
│   │   │   └── [id]/page.tsx     # 상품 상세 (/products/[id])
│   │   │
│   │   ├── cart/page.tsx     # 장바구니 (/cart)
│   │   ├── checkout/page.tsx # 주문/결제 (/checkout)
│   │   │
│   │   ├── mypage/           # 마이페이지 (로그인 필요)
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/            # 관리자 백오피스 (admin 권한 필요)
│   │   │   ├── page.tsx          # 대시보드
│   │   │   ├── products/page.tsx # 상품 관리
│   │   │   └── orders/page.tsx   # 주문 관리
│   │   │
│   │   └── api/              # Next.js API Route (서버 엔드포인트)
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── orders/route.ts
│   │       └── admin/
│   │           ├── products/route.ts
│   │           └── orders/[id]/route.ts
│   │
│   ├── components/           # 재사용 UI 컴포넌트
│   │   ├── ui/               # Shadcn UI 자동 생성 컴포넌트 (수정 금지)
│   │   └── (직접 작성 컴포넌트들)
│   │       # Header.tsx, ProductCard.tsx, CartItem.tsx 등
│   │
│   ├── lib/                  # 설정 & 유틸리티
│   │   ├── auth.ts           # NextAuth 메인 설정 (handlers, signIn, signOut, auth)
│   │   ├── auth.config.ts    # NextAuth 인가 설정 (미들웨어와 공유)
│   │   ├── db.ts             # Prisma 클라이언트 싱글톤
│   │   ├── queryKeys.ts      # TanStack Query Key 중앙 관리
│   │   └── utils.ts          # 공통 유틸 함수 (cn 등)
│   │
│   ├── store/                # Zustand 클라이언트 상태 스토어
│   │   └── cartStore.ts      # 장바구니 전역 상태
│   │
│   ├── actions/              # Next.js Server Actions
│   │   ├── auth.actions.ts   # 회원가입 등 인증 관련 서버 액션
│   │   └── order.actions.ts  # 주문 처리 서버 액션
│   │
│   ├── schemas/              # Zod 유효성 검사 스키마
│   │   ├── auth.schema.ts    # 로그인/회원가입 스키마
│   │   ├── product.schema.ts # 상품 등록 스키마
│   │   └── order.schema.ts   # 주문 폼 스키마
│   │
│   ├── types/                # TypeScript 타입 정의
│   │   ├── next-auth.d.ts    # NextAuth 세션 타입 확장
│   │   └── index.ts          # 공통 타입 (Product, Order 등)
│   │
│   └── middleware.ts         # 라우트 접근 권한 제어 (Next.js 미들웨어)
│
├── docs/                     # 수업 문서
│   ├── SHOPPING_PLAN.md      # 10일 전체 커리큘럼 목차
│   ├── ARCHITECTURE.md       # 이 파일 — 프로젌트 구조 가이드
│   ├── WORK.md               # 현재 진행 중인 작업
│   ├── HISTORY.md            # 완료된 작업 이력
│   └── steps/                # 챕터별 상세 수업 자료
│       ├── step-01-setup.md
│       ├── step-02-db-schema.md
│       └── ...
│
├── CLAUDE.md                 # AI 행동 규칙 (기술 스택, 버전, 명령어)
├── .env.local                # 환경변수 (Git 제외)
└── next.config.ts            # Next.js 설정
```

---

## 2. 핵심 파일별 역할 설명

### 🔐 인증 & 인가 — 3개 파일이 역할 분담

인증(Authentication)과 인가(Authorization)는 **반드시 분리**해야 한다.
미들웨어는 Edge Runtime에서 실행되기 때문에 Prisma(Node.js 전용)를 직접 사용할 수 없다.
이 제약 때문에 설정 파일을 둘로 나눈다.

```
src/lib/auth.ts          ← 메인 서버 인증 설정
src/lib/auth.config.ts   ← 미들웨어와 공유하는 인가 설정
src/middleware.ts        ← 라우트별 접근 권한 제어
```

| 파일 | 실행 환경 | 역할 |
| --- | --- | --- |
| `lib/auth.ts` | Node.js (서버) | NextAuth 핵심 설정. Prisma로 DB 조회, 비밀번호 검증, 세션 생성 |
| `lib/auth.config.ts` | Edge + Node.js 공용 | 미들웨어와 공유 가능한 설정만 담음. Prisma 사용 불가 |
| `middleware.ts` | Edge Runtime | 모든 요청 전에 실행. 로그인 여부·역할(role) 확인 후 리다이렉트 |

---

### 🗄️ DB 연결 — `lib/db.ts`

```ts
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Next.js 개발 서버는 핫 리로드 시 모듈을 재실행한다.
그냥 `new PrismaClient()`를 쓰면 리로드마다 DB 커넥션이 새로 생겨 커넥션 풀이 폭발한다.
`global` 객체에 인스턴스를 저장해 **싱글톤**으로 유지하는 것이 표준 패턴이다.

---

### 🛒 클라이언트 상태 — `store/cartStore.ts`

Zustand를 사용한다. 장바구니는 **서버가 아닌 브라우저에서만 관리**하는 클라이언트 상태다.
`persist` 미들웨어로 localStorage에 저장하여 새로고침 후에도 장바구니가 유지된다.

```
store/cartStore.ts    ← 장바구니 (add / remove / update / clear)
```

> 주문이 완료되면 `clear()`를 호출해 장바구니를 초기화한다.

---

### 🌐 API Route — `app/api/`

Next.js App Router에서 서버 API 엔드포인트는 `app/api/` 아래 `route.ts` 파일로 만든다.

| 파일 | 메서드 | 역할 |
| --- | --- | --- |
| `api/auth/[...nextauth]/route.ts` | GET, POST | NextAuth 자동 처리 (로그인, 콜백, 세션) |
| `api/orders/route.ts` | GET, POST | 주문 목록 조회 / 주문 생성 |
| `api/admin/products/route.ts` | POST | 관리자 상품 등록 |
| `api/admin/orders/[id]/route.ts` | PATCH | 관리자 주문 상태 변경 |

---

### ⚡ Server Actions — `actions/`

폼 제출처럼 **단순 쓰기 작업**은 API Route 대신 Server Action을 사용한다.
별도 API 엔드포인트 없이 서버 함수를 직접 호출하는 Next.js 패턴이다.

```
actions/auth.actions.ts    ← 회원가입 (register)
actions/order.actions.ts   ← 주문 생성 트랜잭션
```

---

### ✅ Zod 스키마 — `schemas/`

폼 유효성 검사와 API 요청 검증에 사용한다.
`React Hook Form`의 `resolver`와 연결하면 폼 상태 관리와 유효성 검사를 동시에 처리할 수 있다.

```
schemas/auth.schema.ts     ← 이메일 형식, 비밀번호 최소 길이 등
schemas/order.schema.ts    ← 배송지 주소, 수신자 이름 등
schemas/product.schema.ts  ← 상품명, 가격(양수), 재고 등
```

---

### 🔑 Query Key 중앙 관리 — `lib/queryKeys.ts`

TanStack Query는 Key로 캐시를 관리한다.
Key가 컴포넌트에 흩어지면 `invalidateQueries` 호출 시 오타로 캐시가 갱신되지 않는 버그가 생긴다.
한 파일에 모아서 관리하면 이 문제를 예방할 수 있다.

```ts
export const queryKeys = {
  products: {
    all: ['products'] as const,
    detail: (id: number) => ['products', id] as const,
  },
  orders: {
    byUser: (userId: string) => ['orders', userId] as const,
    all: ['orders'] as const,
  },
}
```

---

## 3. 상태 관리 분류 원칙

새 기능을 만들 때 "이 데이터를 어디서 관리할까?" 를 판단하는 기준이다.

| 상태 종류 | 관리 위치 | 예시 |
| --- | --- | --- |
| 서버 데이터 (읽기) | TanStack Query | 상품 목록, 주문 내역 |
| 클라이언트 전역 상태 | Zustand | 장바구니 |
| 폼 입력 상태 | React Hook Form | 배송지 입력, 로그인 폼 |
| 컴포넌트 로컬 상태 | useState | 모달 열림/닫힘, 수량 선택 |

---

## 4. 라우트 보호 규칙

```
/                    → 누구나 접근 가능
/products/**         → 누구나 접근 가능
/cart                → 누구나 접근 가능
/checkout            → 로그인한 사용자만
/mypage/**           → 로그인한 사용자만
/admin/**            → role: 'admin' 사용자만
```

이 규칙은 `src/middleware.ts`에서 `auth.config.ts`를 참조하여 적용된다.
