import Link from "next/link";

export default function OrderCompletePage() {
  return (
    <div className="text-center py-20">
      <p className="text-6xl mb-6">🎉</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        주문이 완료되었습니다!
      </h1>
      <p className="text-gray-500 mb-8">
        주문 내역은 마이페이지에서 확인할 수 있습니다.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/mypage"
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          주문 내역 보기
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
