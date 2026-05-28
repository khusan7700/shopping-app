import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding 시작...");

  // ── 0. 관리자 계정 ──────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {},
    create: {
      email: "admin@shop.com",
      password: hashedPassword,
      name: "관리자",
      role: "admin",
    },
  });
  console.log("✅ 관리자 계정 생성 완료");

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

  // ── 3. FAQ 더미 데이터 ─────────────────────────────────
  await prisma.faq.createMany({
    data: [
      // 배송
      { question: "배송은 얼마나 걸리나요?", answer: "일반 배송은 2~3 영업일, 빠른배송(무료배송 조건 충족 시)은 익일 도착을 보장합니다.", category: "배송", sortOrder: 1 },
      { question: "무료 배송 조건이 어떻게 되나요?", answer: "주문 금액이 30,000원 이상이면 무료 배송이 적용됩니다. 그 이하의 경우 배송비 3,000원이 부과됩니다.", category: "배송", sortOrder: 2 },
      { question: "해외 배송도 가능한가요?", answer: "현재는 국내 배송만 지원하고 있습니다. 해외 배송 서비스는 추후 추가될 예정입니다.", category: "배송", sortOrder: 3 },
      // 주문/결제
      { question: "주문 취소는 어떻게 하나요?", answer: "마이페이지 > 주문 내역에서 결제 대기 상태의 주문만 취소 가능합니다. 배송이 시작된 이후에는 취소가 불가합니다.", category: "주문·결제", sortOrder: 1 },
      { question: "어떤 결제 수단을 사용할 수 있나요?", answer: "신용카드, 체크카드, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.", category: "주문·결제", sortOrder: 2 },
      { question: "영수증 발급이 가능한가요?", answer: "마이페이지 > 주문 내역에서 각 주문의 영수증을 PDF로 다운로드할 수 있습니다.", category: "주문·결제", sortOrder: 3 },
      // 반품/교환
      { question: "반품 기간은 얼마나 되나요?", answer: "상품 수령일로부터 7일 이내에 반품 신청이 가능합니다. 단, 상품의 태그가 제거되거나 사용 흔적이 있는 경우 반품이 불가합니다.", category: "반품·교환", sortOrder: 1 },
      { question: "교환 방법을 알려주세요.", answer: "고객센터로 문의하시거나 마이페이지에서 교환 신청을 하실 수 있습니다. 교환 배송비는 고객 부담입니다(단, 제품 하자의 경우 무료).", category: "반품·교환", sortOrder: 2 },
      // 계정
      { question: "비밀번호를 잊었어요.", answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하시면 가입하신 이메일로 재설정 링크를 보내드립니다.", category: "계정", sortOrder: 1 },
      { question: "회원 탈퇴는 어떻게 하나요?", answer: "마이페이지 > 설정 > 회원 탈퇴에서 신청하실 수 있습니다. 탈퇴 후에는 모든 주문 내역 및 적립금이 삭제됩니다.", category: "계정", sortOrder: 2 },
      { question: "개인정보는 안전하게 보호되나요?", answer: "저희는 개인정보보호법을 준수하며, 모든 데이터는 암호화되어 안전하게 저장됩니다. 자세한 내용은 개인정보처리방침을 참조해주세요.", category: "계정", sortOrder: 3 },
      // 상품
      { question: "상품 사이즈 선택이 어려워요.", answer: "각 상품 상세 페이지의 '사이즈 가이드'를 참고해주세요. 정확한 치수(가슴둘레, 허리둘레 등)를 측정하시면 더 정확한 선택이 가능합니다.", category: "상품", sortOrder: 1 },
      { question: "재입고 알림을 받을 수 있나요?", answer: "품절된 상품 상세 페이지에서 '재입고 알림 신청' 버튼을 누르시면 재입고 시 이메일로 알림을 보내드립니다.", category: "상품", sortOrder: 2 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ FAQ 더미 데이터 삽입 완료");

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
