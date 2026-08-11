import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/sidebar-left";

const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Administration | Podomus",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${montserrat.className} admin-layout min-h-screen bg-slate-50`}>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset className="flex-1">
          {children}
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-center" richColors />
    </div>
  )
}