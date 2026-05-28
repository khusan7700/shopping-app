import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().default("일반"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

function isAdmin(session: any) {
  return session?.user && (session.user as any).role === "admin";
}

// GET /api/admin/faq — all FAQs (including inactive)
export async function GET() {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(faqs);
}

// POST /api/admin/faq — create FAQ
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  const body = await req.json();
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const faq = await prisma.faq.create({ data: parsed.data });
  return NextResponse.json(faq, { status: 201 });
}
