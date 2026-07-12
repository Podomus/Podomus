"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users, CalendarDays, Package, MessageSquare,
  Clock, LogOut, Plus, UserPlus, ClipboardList,
  ChevronRight,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalPatients: number
  totalAppointments: number
  totalProducts: number
  upcomingAppointments: number
  completedAppointments: number
  pendingProducts: number
  deliveredProducts: number
}

interface Appointment {
  id: string
  patientName: string
  date: string
  status: string
}

interface Delivery {
  id: string
  patientName: string
  type: string
  dateLivraison: string | null
}

// ─── Status badge config ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  scheduled: { label: "Planifié",  className: "bg-blue-100  text-blue-700  border-blue-200"  },
  completed: { label: "Terminé",   className: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Annulé",    className: "bg-red-100   text-red-700   border-red-200"   },
  no_show:   { label: "Absent",    className: "bg-gray-100  text-gray-600  border-gray-200"  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}
function fmtDelivery(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "Date à définir"
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, iconBg, label, value, sub, index,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: number
  sub: string
  index: number
}) {
  return (
    <Card
      className="bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 ease-out border border-slate-100 animate-in fade-in-0 slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 50}ms`, animationDuration: "300ms", animationFillMode: "both" }}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>{icon}</div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{label}</p>
            <p className="text-3xl font-bold text-softtail-800 mt-1 leading-none">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card className="bg-white border border-slate-100">
      <CardContent className="p-5 flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [recentAppointments, setRecentAppointments] = React.useState<Appointment[]>([])
  const [pendingDeliveries, setPendingDeliveries] = React.useState<Delivery[]>([])
  const [newMessages, setNewMessages] = React.useState(0)

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/login")
  }

  React.useEffect(() => {
    const init = async () => {
      const { data } = await authClient.getSession()
      if (!data?.user || data.user.email !== "admin@podomus.local") {
        router.push("/login")
        return
      }

      const [statsRes, aptsRes, deliveriesRes, messagesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/recent-appointments"),
        fetch("/api/admin/pending-deliveries"),
        fetch("/api/contact"),
      ])

      if (statsRes.ok)      setStats(await statsRes.json())
      if (aptsRes.ok)       setRecentAppointments(await aptsRes.json())
      if (deliveriesRes.ok) setPendingDeliveries(await deliveriesRes.json())
      if (messagesRes.ok) {
        const msgs: { status: string }[] = await messagesRes.json()
        setNewMessages(msgs.filter((m) => m.status === "new").length)
      }

      setLoading(false)
    }
    init().catch(() => router.push("/login"))
  }, [router])

  const todayFR = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-softtail-800">Bonjour, Sonda 👋</h1>
          <p className="text-sm text-slate-500 mt-1 capitalize">{todayFR}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 active:scale-[0.97] self-start sm:self-auto"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={<Users className="h-5 w-5 text-blue-600" />}
              iconBg="bg-blue-50"
              label="Patients total"
              value={stats?.totalPatients ?? 0}
              sub="patients enregistrés"
              index={0}
            />
            <StatCard
              icon={<CalendarDays className="h-5 w-5 text-emerald-600" />}
              iconBg="bg-emerald-50"
              label="Rendez-vous aujourd'hui"
              value={stats?.upcomingAppointments ?? 0}
              sub="rendez-vous à venir"
              index={1}
            />
            <StatCard
              icon={<Package className="h-5 w-5 text-amber-600" />}
              iconBg="bg-amber-50"
              label="Orthèses en attente"
              value={stats?.pendingProducts ?? 0}
              sub="en cours de fabrication"
              index={2}
            />
            <StatCard
              icon={<MessageSquare className="h-5 w-5 text-violet-600" />}
              iconBg="bg-violet-50"
              label="Nouveaux messages"
              value={newMessages}
              sub="messages non lus"
              index={3}
            />
          </>
        )}
      </div>

      {/* ── Two-column lists ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Rendez-vous récents */}
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold text-softtail-800 flex items-center gap-2">
              <Clock className="h-4 w-4 text-softtail-500" />
              Rendez-vous récents
            </CardTitle>
            <button
              onClick={() => router.push("/admin/appointments")}
              className="text-xs text-slate-400 hover:text-softtail-700 flex items-center gap-0.5 transition-[color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              Voir tout <ChevronRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ListSkeleton />
            ) : recentAppointments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Aucun rendez-vous récent</p>
            ) : (
              <ul className="space-y-1">
                {recentAppointments.map((apt) => {
                  const cfg = STATUS_CONFIG[apt.status] ?? { label: apt.status, className: "bg-gray-100 text-gray-600 border-gray-200" }
                  return (
                    <li
                      key={apt.id}
                      className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm text-softtail-800">{apt.patientName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {fmtDate(apt.date)} · {fmtTime(apt.date)}
                        </p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${cfg.className}`}>
                        {cfg.label}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Orthèses en attente */}
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold text-softtail-800 flex items-center gap-2">
              <Package className="h-4 w-4 text-softtail-500" />
              Orthèses en attente
            </CardTitle>
            <button
              onClick={() => router.push("/admin/orders")}
              className="text-xs text-slate-400 hover:text-softtail-700 flex items-center gap-0.5 transition-[color,transform] duration-150 ease-out active:scale-[0.97]"
            >
              Voir tout <ChevronRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ListSkeleton />
            ) : pendingDeliveries.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Aucune orthèse en attente</p>
            ) : (
              <ul className="space-y-1">
                {pendingDeliveries.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <div className="min-w-0 mr-4">
                      <p className="font-medium text-sm text-softtail-800 truncate">{d.patientName}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{d.type}</p>
                    </div>
                    <span className="text-xs text-amber-600 font-medium whitespace-nowrap shrink-0">
                      {fmtDelivery(d.dateLivraison)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick actions ─────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Actions rapides
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => router.push("/admin/appointments")}
            className="gap-2 bg-softtail-700 hover:bg-softtail-800 text-white active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            Nouveau rendez-vous
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/patients")}
            className="gap-2 active:scale-[0.97]"
          >
            <UserPlus className="h-4 w-4" />
            Nouveau patient
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/ortheses")}
            className="gap-2 active:scale-[0.97]"
          >
            <ClipboardList className="h-4 w-4" />
            Nouvelle orthèse
          </Button>
        </div>
      </div>

    </div>
  )
}
