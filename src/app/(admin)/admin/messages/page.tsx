"use client"

import { useEffect, useState } from "react"
import { TbMessageCircle, TbTrash, TbArchive, TbMail, TbPhone, TbInbox, TbCheck } from "react-icons/tb"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
}

type FilterTab = "all" | "new" | "read" | "archived"

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  read: "Lu",
  replied: "Répondu",
  archived: "Archivé",
}

function StatusBadge({ status }: { status: string }) {
  const cls = {
    new: "bg-red-100 text-red-700 border-red-200",
    read: "bg-gray-100 text-gray-600 border-gray-200",
    replied: "bg-green-100 text-green-700 border-green-200",
    archived: "bg-amber-100 text-amber-700 border-amber-200",
  }[status] ?? "bg-gray-100 text-gray-600 border-gray-200"

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors duration-150", cls)}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function StatusDot({ status }: { status: string }) {
  const cls = {
    new: "bg-red-500",
    read: "bg-gray-400",
    replied: "bg-green-500",
    archived: "bg-amber-400",
  }[status] ?? "bg-gray-400"
  return <span className={cn("inline-block w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-150", cls)} />
}

function formatDate(dateString: string) {
  const d = new Date(dateString)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

function formatDateFull(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function MessagesPage() {
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(true)
  const [sessionUser, setSessionUser] = useState<{ name?: string; email: string } | null>(null)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterTab>("all")

  // Auth check
  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (!data?.user || data.user.email !== "admin@podomus.local") {
        router.push("/login")
        return
      }
      setSessionUser({ name: data.user.name ?? undefined, email: data.user.email })
      setAuthLoading(false)
    }).catch(() => router.push("/login"))
  }, [router])

  async function fetchMessages() {
    try {
      const res = await fetch("/api/contact")
      if (res.ok) setMessages(await res.json())
    } catch (e) {
      console.error("Erreur récupération messages:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading])

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
      }
    } catch (e) {
      console.error("Erreur mise à jour statut:", e)
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Supprimer ce message définitivement ?")) return
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" })
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id))
        if (selectedId === id) setSelectedId(null)
      }
    } catch (e) {
      console.error("Erreur suppression:", e)
    }
  }

  function handleSelectMessage(msg: ContactMessage) {
    setSelectedId(msg.id)
    if (msg.status === "new") {
      updateStatus(msg.id, "read")
    }
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "new", label: "Nouveaux" },
    { key: "read", label: "Lus" },
    { key: "archived", label: "Archivés" },
  ]

  const filteredMessages = messages.filter(m => {
    if (filter === "all") return true
    if (filter === "read") return m.status === "read" || m.status === "replied"
    return m.status === filter
  })

  const selectedMessage = messages.find(m => m.id === selectedId) ?? null

  const countFor = (tab: FilterTab) => {
    if (tab === "all") return messages.length
    if (tab === "read") return messages.filter(m => m.status === "read" || m.status === "replied").length
    return messages.filter(m => m.status === tab).length
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-softtail-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-softtail-200 border-t-softtail-500 rounded-full animate-spin" />
          <p className="text-softtail-600 font-medium text-sm">Chargement des messages…</p>
        </div>
      </div>
    )
  }

  if (!sessionUser) return null

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-softtail-50/30 to-white">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between px-6 border-b border-softtail-100 bg-white/90 backdrop-blur-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/dashboard" className="text-softtail-600 hover:text-softtail-700 text-sm">
                Tableau de bord
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block text-softtail-300" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-softtail-800 font-semibold text-sm">Messages</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-softtail-800">{sessionUser.name || "Administrateur"}</p>
            <p className="text-xs text-softtail-500">{sessionUser.email}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-softtail-500 to-softtail-600 flex items-center justify-center shadow">
            <span className="text-sm font-bold text-white">
              {(sessionUser.name || "A").charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* Page title strip */}
      <div className="px-6 py-3 border-b border-softtail-100 bg-white/70 flex items-center gap-3">
        <TbInbox className="h-5 w-5 text-softtail-500" />
        <h1 className="text-lg font-bold text-softtail-800">Boîte de réception</h1>
        {messages.filter(m => m.status === "new").length > 0 && (
          <Badge className="bg-red-500 text-white border-0 text-xs px-2">
            {messages.filter(m => m.status === "new").length} nouveau{messages.filter(m => m.status === "new").length > 1 ? "x" : ""}
          </Badge>
        )}
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel – message list */}
        <div className="w-1/3 min-w-[280px] flex flex-col border-r border-softtail-100 bg-white overflow-hidden">
          {/* Filter tabs */}
          <div className="flex border-b border-softtail-100 bg-softtail-50/50">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "flex-1 py-2.5 text-xs font-medium transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.97] relative",
                  filter === tab.key
                    ? "text-softtail-700 bg-white border-b-2 border-softtail-500"
                    : "text-softtail-500 hover:text-softtail-700 hover:bg-softtail-50"
                )}
              >
                {tab.label}
                {countFor(tab.key) > 0 && (
                  <span className={cn(
                    "ml-1 text-[10px] font-semibold rounded-full px-1",
                    tab.key === "new" ? "text-red-600" : "text-softtail-400"
                  )}>
                    {countFor(tab.key)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-softtail-400 p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <TbMessageCircle className="h-10 w-10 opacity-40" />
                <p className="text-sm text-center">Aucun message dans cette catégorie</p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-softtail-50 transition-[background-color,border-color] duration-150",
                    selectedId === msg.id
                      ? "bg-softtail-50 border-l-2 border-l-softtail-500 active:bg-softtail-100/80"
                      : "hover:bg-gray-50 active:bg-gray-100",
                    msg.status === "new" && "bg-red-50/40 hover:bg-red-50/60 active:bg-red-50/80"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <StatusDot status={msg.status} />
                      <span className={cn(
                        "text-sm truncate",
                        msg.status === "new" ? "font-bold text-softtail-900" : "font-medium text-softtail-700"
                      )}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-softtail-400 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className={cn(
                    "text-xs truncate pl-4",
                    msg.status === "new" ? "text-softtail-700 font-medium" : "text-softtail-500"
                  )}>
                    {msg.subject}
                  </p>
                  <p className="text-xs text-softtail-400 truncate pl-4 mt-0.5">
                    {msg.message}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right panel – message detail */}
        <div className="flex-1 overflow-y-auto bg-softtail-50/20">
          {!selectedMessage ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-softtail-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-16 h-16 rounded-full bg-softtail-100 flex items-center justify-center">
                <TbInbox className="h-8 w-8 text-softtail-400" />
              </div>
              <p className="text-base font-medium">Sélectionnez un message</p>
              <p className="text-sm opacity-70">Cliquez sur un message dans la liste pour le lire</p>
            </div>
          ) : (
            <div className="p-6 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Card className="shadow-sm border-softtail-100">
                <div className="p-6 space-y-5">
                  {/* Header: subject + badge */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-softtail-800 leading-tight">{selectedMessage.subject}</h2>
                    <StatusBadge status={selectedMessage.status} />
                  </div>

                  <Separator className="bg-softtail-100" />

                  {/* Sender info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-8 w-8 rounded-full bg-softtail-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-softtail-600">
                          {selectedMessage.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-softtail-800">{selectedMessage.name}</p>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-xs text-softtail-500 hover:text-softtail-700 flex items-center gap-1"
                        >
                          <TbMail className="h-3 w-3" />
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2 text-xs text-softtail-500 pl-10">
                        <TbPhone className="h-3.5 w-3.5" />
                        <span>{selectedMessage.phone}</span>
                      </div>
                    )}
                    <p className="text-xs text-softtail-400 pl-10">
                      Reçu le {formatDateFull(selectedMessage.createdAt)}
                    </p>
                  </div>

                  <Separator className="bg-softtail-100" />

                  {/* Message body */}
                  <div className="bg-white rounded-lg border border-softtail-100 p-4">
                    <p className="text-sm text-softtail-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <Separator className="bg-softtail-100" />

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {selectedMessage.status !== "read" && selectedMessage.status !== "replied" && selectedMessage.status !== "archived" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(selectedMessage.id, "read")}
                        className="text-softtail-700 border-softtail-200 hover:bg-softtail-50 active:scale-[0.97] transition-transform duration-100"
                      >
                        <TbCheck className="h-4 w-4 mr-1.5" />
                        Marquer comme lu
                      </Button>
                    )}
                    {selectedMessage.status !== "archived" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(selectedMessage.id, "archived")}
                        className="text-amber-700 border-amber-200 hover:bg-amber-50 active:scale-[0.97] transition-transform duration-100"
                      >
                        <TbArchive className="h-4 w-4 mr-1.5" />
                        Archiver
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50 ml-auto active:scale-[0.97] transition-transform duration-100"
                    >
                      <TbTrash className="h-4 w-4 mr-1.5" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
