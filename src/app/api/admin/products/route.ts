import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/schemas/product.schema";

// ── 공통 권한 체크 헬퍼 ──────────────────────────────
async function checkAdmin() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return null;
  }
  return session;
}

// ── GET: 전체 상품 목록 (관리자용) ──────────────────
export async function GET() {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

// ── POST: 신규 상품 등록 ─────────────────────────────
export async function POST(request: NextRequest) {
  // ① 권한 확인
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  // ② 요청 바디 파싱 + Zod 검증
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않습니다", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, price, stock, category, description, imageUrl } = parsed.data;

  // ③ DB 저장 — 빈 문자열은 null 로 변환
  const product = await prisma.product.create({
    data: {
      name,
      price,
      stock,
      category: category || null,
      description: description || null,
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
