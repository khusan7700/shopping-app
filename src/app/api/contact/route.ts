import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(1, "메시지를 입력해주세요").max(1000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      message: parsed.data.message,
      userId: session?.user?.id ?? null,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
