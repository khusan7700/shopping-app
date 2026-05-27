import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding 시작...");

  // ── 1. 공통코드 (주문상태) ──────────────────────────
  await prisma.systemCode.createMany({
    data: [
      {
        groupCode: "ORDER_STATUS",
        groupLabel: "주문상태",
        code: "PENDING",
        label: "결제대기",
        sortOrder: 1,
      },
      {
        groupCode: "ORDER_STATUS",
        groupLabel: "주문상태",
        code: "PAID",
        label: "결제완료",
        sortOrder: 2,
      },
      {
        groupCode: "ORDER_STATUS",
        groupLabel: "주문상태",
        code: "SHIPPING",
        label: "배송중",
        sortOrder: 3,
      },
      {
        groupCode: "ORDER_STATUS",
        groupLabel: "주문상태",
        code: "DONE",
        label: "배송완료",
        sortOrder: 4,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ 공통코드 삽입 완료");

  // ── 2. 더미 상품 10개 ───────────────────────────────
  await prisma.product.createMany({
    data: [
      {
        name: "클래식 화이트 티셔츠",
        description: "어디서나 잘 어울리는 베이직 화이트 티셔츠",
        price: 29000,
        stock: 100,
        category: "상의",
        imageUrl: "/images/products/product1.jpg",
      },
      {
        name: "슬림핏 청바지",
        description: "활동적인 데일리 슬림핏 청바지",
        price: 59000,
        stock: 80,
        category: "하의",
        imageUrl: "/images/products/product2.jpg",
      },
      {
        name: "오버핏 후드티",
        description: "루즈하게 입기 좋은 후드 스웨트셔츠",
        price: 49000,
        stock: 60,
        category: "상의",
        imageUrl: "/images/products/product3.jpg",
      },
      {
        name: "레더 미니백",
        description: "데일리로 활용하기 좋은 미니 크로스백",
        price: 89000,
        stock: 40,
        category: "가방",
        imageUrl: "/images/products/product4.jpg",
      },
      {
        name: "캔버스 스니커즈",
        description: "가볍고 편안한 올데이 스니커즈",
        price: 69000,
        stock: 50,
        category: "신발",
        imageUrl: "/images/products/product5.jpg",
      },
      {
        name: "린넨 와이드 팬츠",
        description: "시원한 린넨 소재의 와이드 실루엣 팬츠",
        price: 55000,
        stock: 70,
        category: "하의",
        imageUrl: "/images/products/product6.jpg",
      },
      {
        name: "울 가디건",
        description: "부드러운 울 혼방 소재의 가디건",
        price: 79000,
        stock: 45,
        category: "상의",
        imageUrl: "/images/products/product7.jpg",
      },
      {
        name: "버킷햇",
        description: "자외선 차단에 좋은 면 소재 버킷햇",
        price: 25000,
        stock: 90,
        category: "모자",
        imageUrl: "/images/products/product8.jpg",
      },
      {
        name: "실버 체인 목걸이",
        description: "심플한 디자인의 실버 체인 목걸이",
        price: 35000,
        stock: 120,
        category: "액세서리",
        imageUrl: "/images/products/product9.jpg",
      },
      {
        name: "플리스 집업",
        description: "따뜻하고 가벼운 플리스 소재 집업",
        price: 65000,
        stock: 55,
        category: "상의",
        imageUrl: "/images/products/product10.jpg",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ 더미 상품 10개 삽입 완료");

  console.log("🎉 Seeding 완료!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Seeding 실패:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
