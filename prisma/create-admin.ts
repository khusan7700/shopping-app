import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@shopapp.com";
  const password = "admin1234";
  const name = "관리자";

  // 이미 존재하면 role 만 admin 으로 업데이트
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log("✅ 기존 계정을 admin 으로 업데이트:", updated.email);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: { email, password: hashed, name, role: "admin" },
    });
    console.log("✅ admin 계정 생성 완료:", created.email);
  }

  console.log("─────────────────────────");
  console.log(" 이메일  :", email);
  console.log(" 비밀번호:", password);
  console.log("─────────────────────────");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ 실패:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
