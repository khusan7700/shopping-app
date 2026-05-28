"use client";

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-xl font-bold mb-2">상품을 불러오지 못했습니다</h2>
      <p className="text-muted-foreground text-sm mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="glow-btn px-5 py-2.5 rounded-xl text-sm font-semibold"
      >
        다시 시도
      </button>
    </div>
  );
}
