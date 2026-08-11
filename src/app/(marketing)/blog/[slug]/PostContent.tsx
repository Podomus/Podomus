"use client";
import { motion } from 'framer-motion';

const EASE = [0.23, 1, 0.32, 1] as const;

export function PostHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.header
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.header>
  );
}

export function PostBody({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
