"use client"

import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem
          key={item.title}
          className="motion-safe:animate-[nav-item-in_200ms_ease-out_both]"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <SidebarMenuButton
            asChild
            isActive={item.isActive}
            className={cn(
              "border-l-2 border-transparent",
              "transition-[transform,background-color,color,border-color] duration-150 ease-out",
              "active:scale-[0.97]",
              item.isActive && "border-sidebar-primary"
            )}
          >
            <a href={item.url}>
              <item.icon className="size-4 shrink-0" />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
