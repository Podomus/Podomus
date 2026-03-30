"use client"

import * as React from "react"
import {
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Package,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SignOutButton } from "@/components/signout-button"
import { authClient } from "@/lib/auth-client"

const navItems = [
  { title: "Tableau de bord", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Rendez-vous", url: "/admin/appointments", icon: CalendarDays },
  { title: "Patients", url: "/admin/patients", icon: Users },
  { title: "Orthèses", url: "/admin/ortheses", icon: Package },
  { title: "Messages", url: "/admin/messages", icon: MessageSquare, hasBadge: true },
]

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const [messageBadge, setMessageBadge] = React.useState<number | null>(null)

  React.useEffect(() => {
    fetch("/api/contact?status=new")
      .then((res) => res.json())
      .then((data) => {
        const count = Array.isArray(data) ? data.length : (data?.count ?? null)
        setMessageBadge(count > 0 ? count : null)
      })
      .catch(() => setMessageBadge(null))
  }, [])

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
            Podomus
          </span>
          <span className="text-xs text-muted-foreground">Espace clinique</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.url)
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "gap-3 rounded-lg",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {item.hasBadge && messageBadge !== null && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                        {messageBadge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 py-3 border-t">
        {session?.user?.email && (
          <p className="px-2 pb-2 text-xs text-muted-foreground truncate">
            {session.user.email}
          </p>
        )}
        <SignOutButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
