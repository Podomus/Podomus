"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageTransition from "@/components/PageTransition";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Pages qui ne doivent pas avoir Header/Footer
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth');
  
  const shouldShowHeaderFooter = !isAdminPage && !isAuthPage;

  if (shouldShowHeaderFooter) {
    return (
      <>
        <Header />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
      </>
    );
  }

  // Pour les pages admin et auth, pas de Header/Footer
  return <>{children}</>;
}
