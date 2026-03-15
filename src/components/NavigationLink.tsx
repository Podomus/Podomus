"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function NavigationLink({ 
  href, 
  children, 
  className = "", 
  delay = 0 
}: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -2 }}
    >
      <Link 
        href={href} 
        className={`relative group transition-all duration-300 ${className}`}
      >
        {children}
        <motion.span
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand group-hover:w-full transition-all duration-300"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          animate={{ width: isActive ? "100%" : 0 }}
        />
      </Link>
    </motion.div>
  );
} 