"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks, isToday } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ChevronLeft, ChevronRight, Plus, Phone, Clock, Trash2,
  Check, X, UserX, Calendar as CalendarIcon, Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"


// ── Types ──────────────────────────────────────────────────────────────────
interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string | null
  date: Date
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  createdAt: Date
  updatedAt: Date
}

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  scheduled: "Planifié",
  completed: "Terminé",
  cancelled: "Annulé",
  no_show: "Absent",
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  no_show: "bg-gray-100 text-gray-500 border-gray-200",
}

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

// ── Page ───────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [weekStart, setWeekStart] = React.useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = React.useState<string | null>(null)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [refresh, setRefresh] = React.useState(0)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)

  const [form, setForm] = React.useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    date: new Date(),
    time: "09:00",
    duration: "30",
    status: "scheduled",
  })
  const [submitting, setSubmitting] = React.useState(false)

  // Auth + fetch
  React.useEffect(() => {
    const init = async () => {
      try {
        const { data } = await authClient.getSession()
        if (!data?.user || data.user.email !== "admin@podomus.local") {
          router.push("/login")
          return
        }
        const res = await fetch("/api/appointments")
        if (!res.ok) throw new Error()
        const raw = await res.json()
        setAppointments(
          raw.map((a: Appointment & { date: string; createdAt: string; updatedAt: string }) => ({
            ...a,
            date: new Date(a.date),
            createdAt: new Date(a.createdAt),
            updatedAt: new Date(a.updatedAt),
          }))
        )
      } catch {
        toast.error("Impossible de charger les rendez-vous.")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, refresh])

  // Week days
  const weekDays = React.useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  // Appointments for a given day, sorted by time
  const getForDay = React.useCallback(
    (day: Date) =>
      appointments
        .filter((a) => isSameDay(a.date, day))
        .sort((a, b) => {
          const [ah, am] = a.time.split(":").map(Number)
          const [bh, bm] = b.time.split(":").map(Number)
          return ah * 60 + am - (bh * 60 + bm)
        }),
    [appointments]
  )

  const selectedDayAppointments = React.useMemo(
    () => getForDay(selectedDate),
    [getForDay, selectedDate]
  )

  // Week navigation
  const goToPrevWeek = () => setWeekStart((w) => subWeeks(w, 1))
  const goToNextWeek = () => setWeekStart((w) => addWeeks(w, 1))
  const goToToday = () => {
    const today = new Date()
    setWeekStart(startOfWeek(today, { weekStartsOn: 1 }))
    setSelectedDate(today)
  }

  // Status update
  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as Appointment["status"] } : a))
      )
      toast.success(`Statut mis à jour : ${STATUS_LABELS[status]}`)
    } catch {
      toast.error("Erreur lors de la mise à jour du statut.")
    } finally {
      setUpdatingId(null)
    }
  }

  // Delete
  const handleDelete = async () => {
    if (!appointmentToDelete) return
    try {
      const res = await fetch(`/api/appointments/${appointmentToDelete}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentToDelete))
      toast.success("Rendez-vous supprimé.")
    } catch {
      toast.error("Erreur lors de la suppression.")
    } finally {
      setAppointmentToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Create
  const handleCreate = async () => {
    if (!form.patientName || !form.patientEmail || !form.time) {
      toast.error("Veuillez remplir tous les champs obligatoires.")
      return
    }
    setSubmitting(true)
    try {
      const apptDate = new Date(form.date)
      const [h, m] = form.time.split(":").map(Number)
      apptDate.setHours(h, m, 0)
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: form.patientName,
          patientEmail: form.patientEmail,
          patientPhone: form.patientPhone || null,
          date: apptDate.toISOString(),
          time: form.time,
          duration: parseInt(form.duration),
          status: form.status,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        if (res.status === 409) {
          toast.error(err.message || "Créneau déjà réservé.")
          return
        }
        throw new Error()
      }
      toast.success(`Rendez-vous pour ${form.patientName} créé.`)
      setIsAddDialogOpen(false)
      setForm({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        date: new Date(),
        time: "09:00",
        duration: "30",
        status: "scheduled",
      })
      setRefresh((r) => r + 1)
    } catch {
      toast.error("Erreur lors de la création du rendez-vous.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-softtail-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-softtail-200 border-t-softtail-500 rounded-full animate-spin" />
          <p className="text-softtail-600 font-medium text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-softtail-50/30 to-white">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-softtail-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard" className="text-softtail-600 hover:text-softtail-700">
                Tableau de bord
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-softtail-800 font-semibold">Rendez-vous</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          className="bg-softtail-600 hover:bg-softtail-700 text-white gap-1.5"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={16} />
          Nouveau rendez-vous
        </Button>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="p-6 space-y-6 max-w-4xl mx-auto">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-softtail-800 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-softtail-600" />
            Rendez-vous
          </h1>
          <p className="text-softtail-500 text-sm mt-0.5">Gérez les rendez-vous des patients</p>
        </div>

        {/* ── Week strip ───────────────────────────────────────────────── */}
        <Card className="border-softtail-100 shadow-sm">
          <CardHeader className="pb-3 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-softtail-200"
                  onClick={goToPrevWeek}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-softtail-200"
                  onClick={goToNextWeek}
                >
                  <ChevronRight size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-softtail-600 border-softtail-200 hover:bg-softtail-50"
                  onClick={goToToday}
                >
                  Aujourd&apos;hui
                </Button>
              </div>
              <span className="text-sm font-medium text-softtail-700 capitalize">
                {format(weekStart, "MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-7 gap-1.5">
              {weekDays.map((day, i) => {
                const count = getForDay(day).length
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentDay = isToday(day)
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={[
                      "flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all select-none",
                      isSelected
                        ? "bg-softtail-600 text-white shadow"
                        : isCurrentDay
                        ? "bg-softtail-50 ring-1 ring-softtail-300"
                        : "hover:bg-softtail-50",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-[10px] font-semibold uppercase tracking-wider",
                        isSelected ? "text-softtail-100" : "text-softtail-400",
                      ].join(" ")}
                    >
                      {DAY_NAMES[i]}
                    </span>
                    <span
                      className={[
                        "text-lg font-bold leading-none",
                        isSelected ? "text-white" : "text-softtail-800",
                      ].join(" ")}
                    >
                      {format(day, "d")}
                    </span>
                    {count > 0 ? (
                      <span
                        className={[
                          "text-xs font-semibold rounded-full min-w-[1.25rem] text-center px-1 py-0.5 leading-none",
                          isSelected
                            ? "bg-white/25 text-white"
                            : "bg-softtail-100 text-softtail-600",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    ) : (
                      <span className="h-[1.25rem]" />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Day appointment list ─────────────────────────────────────── */}
        <Card className="border-softtail-100 shadow-sm">
          <CardHeader className="pb-3 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-softtail-800 capitalize">
                {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
              </CardTitle>
              <Badge variant="outline" className="text-softtail-600 border-softtail-200 font-normal">
                {selectedDayAppointments.length} rendez-vous
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-14 text-softtail-300">
                <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm text-softtail-400">Aucun rendez-vous ce jour-là</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayAppointments.map((apt) => (
                  <AppointmentRow
                    key={apt.id}
                    appointment={apt}
                    updating={updatingId === apt.id}
                    onStatusChange={(status) => updateStatus(apt.id, status)}
                    onDelete={() => {
                      setAppointmentToDelete(apt.id)
                      setIsDeleteDialogOpen(true)
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── New appointment dialog ───────────────────────────────────────── */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Nouveau rendez-vous</DialogTitle>
            <DialogDescription>
              Remplissez les informations du rendez-vous.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nom du patient <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Nom complet"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={form.patientEmail}
                  onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Téléphone</Label>
                <Input
                  placeholder="06 12 34 56 78"
                  value={form.patientPhone}
                  onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date <span className="text-red-500">*</span></Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4 text-softtail-400" />
                      {format(form.date, "d MMM yyyy", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={form.date}
                      onSelect={(d) => {
                        if (d) {
                          setForm({ ...form, date: d })
                          setDatePickerOpen(false)
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label>Heure <span className="text-red-500">*</span></Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Durée</Label>
                <Select
                  value={form.duration}
                  onValueChange={(v) => setForm({ ...form, duration: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Statut</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="no_show">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-softtail-600 hover:bg-softtail-700"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ──────────────────────────────────────────── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Supprimer le rendez-vous</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Appointment row ────────────────────────────────────────────────────────
function AppointmentRow({
  appointment,
  updating,
  onStatusChange,
  onDelete,
}: {
  appointment: Appointment
  updating: boolean
  onStatusChange: (status: string) => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-softtail-100 bg-white hover:border-softtail-200 hover:shadow-sm transition-all">

      {/* Time block */}
      <div className="flex flex-col items-center justify-center min-w-[3.5rem] text-center">
        <span className="text-sm font-bold text-softtail-800 tabular-nums">{appointment.time}</span>
        <span className="text-[10px] text-softtail-400 flex items-center gap-0.5 mt-0.5">
          <Clock size={9} />
          {appointment.duration} min
        </span>
      </div>

      <Separator orientation="vertical" className="h-10 self-center" />

      {/* Patient info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-softtail-800 text-sm truncate">{appointment.patientName}</p>
        {appointment.patientPhone && (
          <p className="text-xs text-softtail-400 flex items-center gap-1 mt-0.5">
            <Phone size={10} />
            {appointment.patientPhone}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge
          variant="outline"
          className={`text-xs border ${STATUS_COLORS[appointment.status]}`}
        >
          {STATUS_LABELS[appointment.status]}
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {updating ? (
          <Loader2 size={16} className="animate-spin text-softtail-400 mx-2" />
        ) : (
          <>
            {appointment.status !== "completed" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 rounded-lg"
                title="Marquer comme terminé"
                onClick={() => onStatusChange("completed")}
              >
                <Check size={14} />
              </Button>
            )}
            {appointment.status !== "cancelled" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                title="Annuler"
                onClick={() => onStatusChange("cancelled")}
              >
                <X size={14} />
              </Button>
            )}
            {appointment.status !== "no_show" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-50 rounded-lg"
                title="Marquer absent"
                onClick={() => onStatusChange("no_show")}
              >
                <UserX size={14} />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-300 hover:bg-red-50 hover:text-red-500 rounded-lg"
              title="Supprimer"
              onClick={onDelete}
            >
              <Trash2 size={14} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
