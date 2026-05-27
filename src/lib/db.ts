import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * 이 파일은 PrismaClient의 인스턴스를 생성하고, 개발 환경에서는 글로벌 객체에
 * 저장하여 핫 리로드 시에도 동일한 인스턴스를 재사용하도록 합니다. 이렇게 하면
 * 데이터베이스 연결이 불필요하게 여러 번 생성되는 것을 방지할 수 있습니다.
 * 프로덕션 환경에서는 매번 새로운 PrismaClient 인스턴스를 생성하도록 되어 있습니다.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
