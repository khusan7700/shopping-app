import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/faq — public, active FAQs
export async function GET() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(faqs);
}
