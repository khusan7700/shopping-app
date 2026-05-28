import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 group">
      {/* Icon mark */}
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Shopping bag shape */}
          <path
            d="M6 10h20l-2 14H8L6 10z"
            fill="url(#logoGrad)"
            opacity="0.9"
          />
          <path
            d="M12 10V8a4 4 0 0 1 8 0v2"
            stroke="url(#logoGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="13" cy="17" r="1.2" fill="white" opacity="0.8" />
          <circle cx="19" cy="17" r="1.2" fill="white" opacity="0.8" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="text-base font-black tracking-tight gradient-text">
          VIBE
        </span>
        <span className="text-[9px] font-medium text-muted-foreground tracking-widest uppercase">
          shop
        </span>
      </div>
    </Link>
  );
}
