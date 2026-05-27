export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>© 2024 ShopApp. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900">
              이용약관
            </a>
            <a href="#" className="hover:text-gray-900">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-gray-900">
              고객센터
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
