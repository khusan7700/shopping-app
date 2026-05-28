import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/schemas/product.schema";

async function checkAdmin() {
  const session = await auth();
  return session && (session.user as any)?.role === "admin" ? session : null;
}

// PATCH /api/admin/products/[id] — 상품 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, price, stock, category, description, imageUrl } = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      stock,
      category: category || null,
      description: description || null,
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(product);
}

// DELETE /api/admin/products/[id] — 상품 삭제
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
