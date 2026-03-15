"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  FolderOpen,
  Home,
  Inbox,
  MessageCircle,
  MessageCircleQuestion,
  Package,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SignOutButton } from "@/components/signout-button"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Tableau de bord",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Rendez-vous",
      url: "/admin/appointments",
      icon: Calendar,
    },
    {
      title: "Patients",
      url: "/admin/patients",
      icon: Inbox,
    },
    {
      title: "Ordres",
      url: "/admin/orders",
      icon: Blocks,
    },
    {
      title: "Sous Produits",
      url: "/admin/product-catalog",
      icon: Package,
    },
    {
      title: "Produits",
      url: "/admin/categories", 
      icon: FolderOpen,
    },
    {
      title: "Templates des produits ",
      url: "/admin/dynamic-fields",
      icon: Settings2,
    },
    {
      title: "Messages",
      url: "/admin/messages",
      icon: MessageCircle,
      badge: "3", // Vous pouvez le rendre dynamique si nécessaire
    },
    {
      title: "Recherche",
      url: "#",
      icon: Search,
    },
  ],
  navSecondary: [
    {
      title: "Calendrier",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Paramètres",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Aide",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      emoji: "🗣️",
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      emoji: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      emoji: "💰",
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      emoji: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },
  ],
  workspaces: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          emoji: "🎯",
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          emoji: "🧠",
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          emoji: "🤝",
        },
      ],
    },
    {
      name: "Creative Projects",
      emoji: "🎨",
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          emoji: "✍️",
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          emoji: "🖼️",
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          emoji: "🎵",
        },
      ],
    },
    {
      name: "Home Management",
      emoji: "🏡",
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          emoji: "💰",
        },
        {
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          emoji: "🔧",
        },
        {
          name: "Family Calendar & Event Planning",
          url: "#",
          emoji: "📅",
        },
      ],
    },
    {
      name: "Travel & Adventure",
      emoji: "🧳",
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          emoji: "🗺️",
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          emoji: "🌎",
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          emoji: "📸",
        },
      ],
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  // Mettre à jour l'état actif en fonction de l'URL actuelle
  const navItems = data.navMain.map(item => ({
    ...item,
    isActive: pathname === item.url
  }))

  return (
    <Sidebar className="border-r-0 flex flex-col" {...props}>
      <SidebarHeader>
        <NavMain items={navItems} />
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <NavSecondary items={data.navSecondary} className="mt-4" />
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        <SignOutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
