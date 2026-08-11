import Header from "@/components/header";
import Footer from "@/components/footer";
import PageTransition from "@/components/PageTransition";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
