"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, exact = false, className = "", onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors ${
        isActive
          ? "text-indigo-400 dark:text-indigo-300"
          : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}
