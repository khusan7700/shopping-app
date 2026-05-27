# HISTORY.md

완료된 작업 이력을 날짜 순으로 기록한다.

---

## 2026-05-24

### system_codes 엔티티 반정규화 구조 반영 — 교육 목적 스키마 개선

- **변경 파일**: `docs/steps/step-02a-erd.md`, `docs/steps/step-02b-prisma-schema.md`
- **주요 내용**: 학생들의 학습 난이도(JOIN)를 고려하여 `system_codes` 테이블 하나에서 상위/하위 코드 이름을 모두 관리할 수 있도록 `group_label` 컬럼을 추가하는 반정규화 설계 반영 (AI SQL 프롬프트 및 Prisma 스키마 코드 업데이트)

### docs/steps/step-10-deploy.md 생성 — Ch 10 수업 자료

- **변경 파일**: `docs/steps/step-10-deploy.md` (신규)
- **주요 내용**: 개발/프로덕션 환경 비교, migrate dev vs migrate deploy 차이 표, Neon 무료 플랜 설정(싱가포르 리전), prisma migrate deploy + db seed 순서, .gitignore .env 확인, Vercel 환경변수 3개 설정, NEXTAUTH_URL 배포 후 업데이트 방법, GitHub→Vercel 자동 배포 흐름, PR Preview URL 설명, KPT 회고 논의 질문, 확장 아이디어 8가지, 10일 전체 완료 요약 표

### docs/steps/step-09-optimize.md 생성 — Ch 9 수업 자료

- **변경 파일**: `docs/steps/step-09-optimize.md` (신규)
- **주요 내용**: Promise.all 병렬 쿼리 이유(순차 vs 병렬 비교), db.order.aggregate(_count·_sum), generateStaticParams 빌드 시 동작 설명(SSR vs SSG 흐름 비교), revalidate 1시간 재생성, error.tsx('use client' 이유·reset 함수), not-found.tsx 전역·상품 전용 우선순위 설명, API 에러 응답 표준화 체크리스트, npm run build 로그 확인 가이드, 완료 체크리스트

### docs/steps/step-08-admin.md 생성 — Ch 8 수업 자료

- **변경 파일**: `docs/steps/step-08-admin.md` (신규)
- **주요 내용**: 미들웨어+admin layout 이중 권한 체크 구조, layout 중첩 적용 설명, product.schema.ts(z.number()·valueAsNumber·safeParse), POST /api/admin/products(safeParse 400 처리), PATCH /api/admin/orders/[id](VALID_STATUS 배열 검증), useMutation+onSuccess invalidateQueries 자동 갱신 흐름, mutation.isPending으로 select 비활성화, Prisma Studio에서 role 수동 변경 가이드, 완료 체크리스트

### docs/steps/step-07-mypage.md 생성 — Ch 7 수업 자료

- **변경 파일**: `docs/steps/step-07-mypage.md` (신규)
- **주요 내용**: TanStack Query vs useEffect+fetch 비교표, QueryClientProvider 필요 이유, QueryProvider.tsx(useState로 QueryClient 생성 이유), layout.tsx QueryProvider 추가, GET /api/orders(include로 orderItems·product·status 한번에 조회), OrderCard(STATUS_STYLE 코드→색상 매핑·날짜 포맷), mypage/page.tsx(useQuery 3상태 isLoading·isError·data 처리·Skeleton), 캐시 동작 확인(Network 탭), 완료 체크리스트

### docs/steps/step-06-order-checkout.md 생성 — Ch 6 수업 자료

- **변경 파일**: `docs/steps/step-06-order-checkout.md` (신규)
- **주요 내용**: API Route 개념(route.ts → POST 엔드포인트), Prisma Transaction 개념(①②동시 성공 or 동시 롤백), order.schema.ts(receiverPhone 정규식), route.ts(auth() 세션 확인·$transaction·statusCode 'PENDING'), checkout/page.tsx(isSubmitting 버튼 비활성화·items 필요 필드만 전송), order-complete/page.tsx, Prisma Studio 확인 가이드, 비로그인 차단 테스트, 완료 체크리스트

### docs/steps/step-05-cart-zustand.md 생성 — Ch 5 수업 자료

- **변경 파일**: `docs/steps/step-05-cart-zustand.md` (신규)
- **주요 내용**: cartStore(addItem 중복 처리·removeItem·updateQuantity 0이하 자동삭제·clearCart·totalCount·totalPrice), persist+devtools 미들웨어 조합, 동적 라우트 [id] 설명, 상품 상세 page.tsx(notFound·priority 이미지), AddToCartButton('use client' 분리 이유), CartItem(수량 조절·소계), CartSummary(배송비 5만원 기준·주문하기 링크), cart/page.tsx('use client' 이유), CartBadge(9+ 배지), Header 수정, persist 새로고침 테스트·localStorage 확인 가이드, 완료 체크리스트

### docs/steps/step-04-product-list.md 생성 — Ch 4 수업 자료

- **변경 파일**: `docs/steps/step-04-product-list.md` (신규)
- **주요 내용**: Header(Server Component + auth() 세션·관리자 메뉴 조건부 렌더링), SignOutButton('use client' 분리 이유), layout.tsx Header 삽입, products/page.tsx(Prisma findMany·searchParams 카테고리 필터·카테고리 목록 동적 조회), ProductCard(next/image fill·aspect-square·toLocaleString), ProductGrid(반응형 grid-cols-2/3/4), loading.tsx(Skeleton 8개 그리드), next.config.ts picsum.photos remotePatterns, 홈 페이지 연결, 동작 확인 가이드 5단계, 완료 체크리스트

### docs/steps/step-03-nextauth.md 생성 — Ch 3 수업 자료

- **변경 파일**: `docs/steps/step-03-nextauth.md` (신규)
- **주요 내용**: movie-app 대비 심화 비교표(실제 DB 저장·bcrypt 암호화·role 분리), .env 설정(NEXTAUTH_SECRET/NEXTAUTH_URL), Zod 스키마(loginSchema/registerSchema), 회원가입 Server Action(bcrypt 해시), Prisma 싱글톤(lib/db.ts), auth.config.ts(protectedRoutes/adminRoutes/authorized 콜백), auth.ts(Credentials provider·jwt·session 콜백으로 role 전달), API Route([...nextauth]/route.ts), middleware.ts, 회원가입·로그인 페이지(React Hook Form + Zod), 테스트 가이드, 완료 체크리스트

---

### docs/SHOPPING_PLAN.md 생성 — 10일 커리큘럼 목차

- **변경 파일**: `docs/SHOPPING_PLAN.md` (신규)
- **주요 내용**: Ch 1~10 전체 목차 아스키아트 계층 구조로 작성, 상세 문서 파일 목록 테이블, 핵심 학습 포인트 요약 표 포함

### docs/steps/step-02c-seed.md 생성 — Ch 2-3 수업 자료

- **변경 파일**: `docs/steps/step-02c-seed.md` (신규)
- **주요 내용**: Seed 개념 설명, 강사 제공 seed.ts(공통코드 4종 + 더미 상품 10개), package.json prisma 블록 추가, ts-node 설치, npx prisma db seed 실행, Prisma Studio + DBeaver 데이터 확인, Day 2 전체 완료 요약

### docs/steps/step-02b-prisma-schema.md 생성 — Ch 2-2 수업 자료

- **변경 파일**: `docs/steps/step-02b-prisma-schema.md` (신규)
- **주요 내용**: Prisma vs SQL 비교표, 5개 모델 단계별 작성(User/Product/SystemCode/Order/OrderItem), @relation 선언 설명, migrate dev 실행 및 오류 체크리스트, Prisma Studio 확인, DBeaver 최종 확인, 완료 체크리스트

### docs/steps/step-02a-erd.md 생성 — Ch 2-1 수업 자료

- **변경 파일**: `docs/steps/step-02a-erd.md` (신규)
- **주요 내용**: 엔티티 추출 개념(5개 엔티티 + 관계 설명), AI 프롬프트 예시(Claude에게 SQL 생성 요청), DrawDB SQL 임포트 → ERD 시각화 → 이미지 저장, DBeaver PostgreSQL 연결 → shopping_db 생성, .env DATABASE_URL 설정, 완료 체크리스트

### docs/steps/step-01-setup.md 생성 — Ch 1 수업 자료

- **변경 파일**: `docs/steps/step-01-setup.md` (신규)
- **주요 내용**: PRD 리뷰(User Stories 7개, 페이지 라우트 맵), 기술 스택 역할 정리표(Prisma vs SQL 비교, Zustand/TanStack Query 분리 원칙), 프로젝트 생성 7단계(create-next-app 고정 버전, 라이브러리 설치, Shadcn 초기화, Prisma 초기화), 완료 체크리스트

### docs/ARCHITECTURE.md 생성 — 프로젝트 구조 가이드

- **변경 파일**: `docs/ARCHITECTURE.md` (신규)
- **주요 내용**: 전체 폴더 구조 트리, 인증/인가 3파일 역할 분담 설명, DB 싱글톤 패턴, Zustand 장바구니, API Route vs Server Action 구분, Zod 스키마 위치 규칙, Query Key 중앙 관리, 상태 관리 분류 원칙, 라우트 보호 규칙

---

## 2026-05-20

### Step 2 수업 자료 개선 — step-02-home-movie-list.md

- **변경 파일**: `docs/steps/step-02-home-movie-list.md`
- **주요 내용**
  - 원칙 2 적용: 각 섹션 상단에 `✅ 새로 생성 / 수정` 명시 + "아래 코드를 입력합니다" 행동 지침 추가
  - 원칙 5 적용: 코드 전에 WHY 단락 추가 (왜 서버 컴포넌트인지, 왜 이 파일이 필요한지)
  - 원칙 6 적용: `<img>`/`<a>` vs `<Image>`/`<Link>` ❌/✅ 비교 추가
  - 원칙 7 적용: 파일 연결 구조 ASCII 트리 추가
  - 원칙 8 적용: movie-app 비교 3곳 제거, "서버에서 데이터를 fetch하면 어떻게 다른가" 독립 섹션으로 재작성 (CSR vs 서버 컴포넌트 흐름 비교)
  - 이 단계의 핵심 목표 섹션 추가
  - Tailwind v4 정식 클래스 적용: `aspect-[2/3]` → `aspect-2/3`

### next/image 외부 호스트 설정 누락 오류 수정

- **변경 파일**: `next.config.ts`
- **문제**: `next/image`로 TMDB 포스터를 로드할 때 `hostname "image.tmdb.org" is not configured` 런타임 오류 발생
- **원인**: `next/image`는 보안상 외부 이미지 호스트를 `next.config.ts`에 명시적으로 허용해야 함
- **수정**: `images.remotePatterns`에 `https://image.tmdb.org` 추가. 설정 변경 후 개발 서버 재시작 필요

---

## 2026-05-17

### MOVIE_PLAN.md 분리 완료 — Steps 4·5·6 독립 step 파일 생성

- **변경 파일**: `docs/MOVIE_PLAN.md`, `docs/steps/step-04-zustand-favorites.md` (신규), `docs/steps/step-05-zod-rhf.md` (신규), `docs/steps/step-06-zustand-persist.md` (신규)
- **주요 내용**: MOVIE_PLAN.md 인라인 Step 4·5·6 섹션을 독립 파일로 분리. MOVIE_PLAN.md는 목차 + 패턴 요약만 남김. step-06에는 persist 동작 확인 절차(@@INIT, localStorage, 수동 삭제 동작), Zustand vs persist 역할 구분, 교육 흐름 구조 포함

### Step 6 완료 — authStore persist + Header

- **변경 파일**: `src/store/authStore.ts`, `src/components/Header.tsx`
- **주요 내용**: authStore에 persist 미들웨어 추가(devtools + persist 조합), Header에 로그인 이메일 표시 + 로그인/로그아웃 버튼 전환 구현

### Step 5 완료 — Zod + React Hook Form + authStore 기본 버전

- **변경 파일**: `src/store/authStore.ts`, `src/schemas/auth.schema.ts`, `src/schemas/search.schema.ts`, `src/pages/Login.tsx`
- **주요 내용**: 로그인 Zod 스키마, 검색 Zod 스키마, authStore 기본 구현(persist 없음), 로그인 폼 전체 구현

### Step 4 완료 — Zustand 즐겨찾기 스토어 + MovieCard + Detail 페이지

- **변경 파일**: `src/store/favoriteStore.ts`, `src/components/MovieCard.tsx`, `src/pages/Detail.tsx`
- **주요 내용**: 즐겨찾기 Zustand 스토어 구현, MovieCard 플레이스홀더 → Link + 카드 UI, Detail 페이지 전체 구현

### MOVIE_PLAN.md devtools 수업 자료 추가

- **변경 파일**: `docs/MOVIE_PLAN.md`
- **주요 내용**: Step 4에 devtools 미들웨어 설명 섹션 추가 (왜 필요한가 / 적용 방법 / 액션 이름 / 팝아웃 버튼 안내), favoriteStore·authStore 코드 블록을 devtools 적용 버전으로 업데이트

### Zustand devtools 미들웨어 적용

- **변경 파일**: `src/store/favoriteStore.ts`, `src/store/authStore.ts`
- **주요 내용**: 두 스토어에 `devtools` 미들웨어 추가. `create<T>()()` 커링 구조로 변경, `name` 옵션으로 Redux DevTools에서 스토어 구별 가능

---

## 2026-05-16

### 다음 세션 계획 수립 — movie-app 신규 프로젝트

- **변경 파일**: `docs/WORK.md` — 다음 세션 작업 계획 및 결정 사항 추가
- **주요 내용**: 기술 스택 확정, fruit-shop3 대비 개선 방향 정리, 시작 순서(PRD → CLAUDE.md → 구현) 결정

### PRD 작성

- **변경 파일**: `docs/PRD.md` — 신규 작성
- **주요 내용**: Overview, User Stories, Functional Requirements(6개 페이지), Data Model, Tech Stack, Non-Functional Requirements, Out of Scope

### CLAUDE.md 작성

- **변경 파일**: `CLAUDE.md` — 신규 작성
- **주요 내용**: 기술 스택, 폴더 구조, 코드 스타일, TanStack Query·Zustand·Zod 규칙, WORK.md·HISTORY.md 관리 규칙

### 프로젝트 생성 및 라이브러리 설치

- **변경 파일**: `package.json`, `src/lib/utils.ts`, `src/components/ui/` (button, card, skeleton, badge, input)
- **주요 내용**: Vite + React + TypeScript 프로젝트 생성, 전체 라이브러리 설치, Shadcn UI 컴포넌트 5종 추가

### PRD Overview 수정 + CLAUDE.md Project Overview 보완

- **변경 파일**:
  - `docs/PRD.md` — 배경·목표를 순수 제품 관점으로 재작성, 기술 스택 내용(핵심 학습 목표 표) 삭제
  - `CLAUDE.md` — Project Overview에 fruit-shop3 맥락, 서버/클라이언트 상태 분리 개념, 기술별 역할 매핑 표 추가
