"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageTransition from "@/components/PageTransition";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Vérifier si on est sur une page admin
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Si c'est une page admin, pas de Header/Footer
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  // Pour les autres pages, afficher Header/Footer
  return (
    <>
      <Header />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </>
  );
}
