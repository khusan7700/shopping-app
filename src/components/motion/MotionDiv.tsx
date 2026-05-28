"use client";

import { motion, type MotionProps } from "framer-motion";

interface MotionDivProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

export function MotionDiv({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}
