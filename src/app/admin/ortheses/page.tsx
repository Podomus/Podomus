"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
  Package, Plus, Edit, Trash2, ArrowRight, Euro, Calendar, User, CalendarCheck,
} from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Orthese {
  id: string
  type: string
  description?: string
  dateCommande: string
  dateLivraison?: string
  prix: number
  status: string
  patientId: string
  patient?: { nom: string; prenom: string }
  champsCustom?: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface Patient {
  id: string
  nom: string
  prenom: string
}

type Status = "commande" | "en_fabrication" | "livree" | "facturee"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<Status, string> = {
  commande: "En commande",
  en_fabrication: "En fabrication",
  livree: "Livrée",
  facturee: "Facturée",
}

const STATUS_NEXT: Record<string, Status | null> = {
  commande: "en_fabrication",
  en_fabrication: "livree",
  livree: "facturee",
  facturee: null,
}

const STATUS_BADGE_CLASSES: Record<Status, string> = {
  commande: "bg-amber-100 text-amber-800 border-amber-200",
  en_fabrication: "bg-blue-100 text-blue-800 border-blue-200",
  livree: "bg-green-100 text-green-800 border-green-200",
  facturee: "bg-purple-100 text-purple-800 border-purple-200",
}

const STATUS_TAB_CLASSES: Record<Status, string> = {
  commande: "data-[state=active]:text-amber-700 data-[state=active]:border-b-2 data-[state=active]:border-amber-500",
  en_fabrication: "data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500",
  livree: "data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500",
  facturee: "data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-500",
}

const EMPTY_FORM = {
  patientId: "",
  type: "",
  description: "",
  prix: "",
  dateLivraison: "",
  status: "commande" as Status,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrthesesPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [ortheses, setOrtheses] = React.useState<Orthese[]>([])
  const [patients, setPatients] = React.useState<Patient[]>([])

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [orthèseToEdit, setOrthèseToEdit] = React.useState<Orthese | null>(null)
  const [orthèseToDelete, setOrthèseToDelete] = React.useState<string | null>(null)

  // Form state
  const [form, setForm] = React.useState({ ...EMPTY_FORM })
  const [submitting, setSubmitting] = React.useState(false)

  // ── Auth ──────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await authClient.getSession()
      if (!data?.user || data.user.email !== "admin@podomus.local") {
        router.push("/login")
        return
      }
      await Promise.all([fetchOrtheses(), fetchPatients()])
      setLoading(false)
    }
    checkAuth()
  }, [router])

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchOrtheses = async () => {
    try {
      const res = await fetch("/api/orders")
      if (!res.ok) throw new Error("Erreur lors du chargement")
      const data = await res.json()
      setOrtheses(data)
    } catch {
      toast.error("Impossible de charger les orthèses")
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients")
      if (!res.ok) throw new Error("Erreur lors du chargement")
      const data = await res.json()
      setPatients(data)
    } catch {
      toast.error("Impossible de charger les patients")
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    })
  }

  const formatPrix = (prix: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix)

  const byStatus = (status: Status) =>
    ortheses.filter((o) => o.status === status)

  // ── Create ────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setForm({ ...EMPTY_FORM })
    setIsCreateOpen(true)
  }

  const handleCreate = async () => {
    if (!form.patientId || !form.type || !form.prix) {
      toast.error("Patient, type et prix sont obligatoires")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: form.patientId,
          type: form.type,
          description: form.description || undefined,
          prix: parseFloat(form.prix),
          dateLivraison: form.dateLivraison || undefined,
          status: form.status,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de la création")
      }
      toast.success("Orthèse créée avec succès")
      setIsCreateOpen(false)
      await fetchOrtheses()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────

  const openEdit = (o: Orthese) => {
    setOrthèseToEdit(o)
    setForm({
      patientId: o.patientId,
      type: o.type,
      description: o.description ?? "",
      prix: String(o.prix),
      dateLivraison: o.dateLivraison
        ? new Date(o.dateLivraison).toISOString().substring(0, 10)
        : "",
      status: o.status as Status,
    })
    setIsEditOpen(true)
  }

  const handleEdit = async () => {
    if (!orthèseToEdit || !form.patientId || !form.type || !form.prix) {
      toast.error("Patient, type et prix sont obligatoires")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/orders/${orthèseToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: form.patientId,
          type: form.type,
          description: form.description || undefined,
          prix: parseFloat(form.prix),
          dateLivraison: form.dateLivraison || undefined,
          status: form.status,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de la mise à jour")
      }
      toast.success("Orthèse mise à jour")
      setIsEditOpen(false)
      setOrthèseToEdit(null)
      await fetchOrtheses()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Advance status ────────────────────────────────────────────────────────

  const handleAdvanceStatus = async (o: Orthese) => {
    const next = STATUS_NEXT[o.status]
    if (!next) return
    try {
      const res = await fetch(`/api/orders/${o.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error("Erreur lors du changement de statut")
      toast.success(`Statut mis à jour : ${STATUS_LABELS[next]}`)
      await fetchOrtheses()
    } catch {
      toast.error("Impossible de changer le statut")
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  const openDelete = (id: string) => {
    setOrthèseToDelete(id)
    setIsDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!orthèseToDelete) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/orders/${orthèseToDelete}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      toast.success("Orthèse supprimée")
      setIsDeleteOpen(false)
      setOrthèseToDelete(null)
      await fetchOrtheses()
    } catch {
      toast.error("Impossible de supprimer l'orthèse")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-500 text-sm animate-pulse">Chargement…</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Tableau de bord</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Orthèses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="h-6 w-6 text-teal-600" />
            Gestion des orthèses
          </h1>
          <p className="text-sm text-slate-500">
            Suivi des commandes d'orthèses plantaires personnalisées
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4" />
          Nouvelle orthèse
        </Button>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["commande", "en_fabrication", "livree", "facturee"] as Status[]).map((s) => {
          const count = byStatus(s).length
          return (
            <div
              key={s}
              className={`rounded-xl border px-4 py-3 flex flex-col gap-0.5 ${STATUS_BADGE_CLASSES[s]}`}
            >
              <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                {STATUS_LABELS[s]}
              </span>
              <span className="text-2xl font-bold">{count}</span>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="commande" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 bg-white border border-slate-200 rounded-xl p-1 h-auto">
          {(["commande", "en_fabrication", "livree", "facturee"] as Status[]).map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              className={`rounded-lg py-2 text-sm font-medium transition-all ${STATUS_TAB_CLASSES[s]}`}
            >
              {STATUS_LABELS[s]}
              <span className="ml-1.5 text-xs opacity-60">({byStatus(s).length})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {(["commande", "en_fabrication", "livree", "facturee"] as Status[]).map((status) => (
          <TabsContent key={status} value={status}>
            {byStatus(status).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <Package className="h-10 w-10 opacity-30" />
                <p className="text-sm">Aucune orthèse dans cette étape</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {byStatus(status).map((o) => (
                  <OrtheseCard
                    key={o.id}
                    orthese={o}
                    statusLabel={STATUS_LABELS[status]}
                    badgeClass={STATUS_BADGE_CLASSES[status]}
                    nextStatus={STATUS_NEXT[o.status]}
                    nextLabel={STATUS_NEXT[o.status] ? STATUS_LABELS[STATUS_NEXT[o.status]!] : null}
                    formatDate={formatDate}
                    formatPrix={formatPrix}
                    onEdit={() => openEdit(o)}
                    onAdvance={() => handleAdvanceStatus(o)}
                    onDelete={() => openDelete(o.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Create dialog ── */}
      <OrtheseDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Nouvelle orthèse"
        description="Enregistrez une nouvelle commande d'orthèse pour un patient."
        patients={patients}
        form={form}
        setForm={setForm}
        onSubmit={handleCreate}
        submitting={submitting}
        submitLabel="Créer l'orthèse"
      />

      {/* ── Edit dialog ── */}
      <OrtheseDialog
        open={isEditOpen}
        onOpenChange={(v) => { setIsEditOpen(v); if (!v) setOrthèseToEdit(null) }}
        title="Modifier l'orthèse"
        description="Mettez à jour les informations de cette orthèse."
        patients={patients}
        form={form}
        setForm={setForm}
        onSubmit={handleEdit}
        submitting={submitting}
        submitLabel="Enregistrer les modifications"
      />

      {/* ── Delete dialog ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L'orthèse sera définitivement supprimée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Card sub-component ───────────────────────────────────────────────────────

interface OrtheseCardProps {
  orthese: Orthese
  statusLabel: string
  badgeClass: string
  nextStatus: Status | null
  nextLabel: string | null
  formatDate: (d?: string) => string
  formatPrix: (p: number) => string
  onEdit: () => void
  onAdvance: () => void
  onDelete: () => void
}

function OrtheseCard({
  orthese: o,
  statusLabel,
  badgeClass,
  nextStatus,
  nextLabel,
  formatDate,
  formatPrix,
  onEdit,
  onAdvance,
  onDelete,
}: OrtheseCardProps) {
  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <CardTitle className="text-base font-semibold text-slate-800 truncate">
              {o.type}
            </CardTitle>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {o.patient ? `${o.patient.prenom} ${o.patient.nom}` : "—"}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 text-xs font-medium border ${badgeClass}`}
          >
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex flex-col gap-3">
        {o.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{o.description}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Euro className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            <span className="font-medium">{formatPrix(o.prix)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-xs">{formatDate(o.dateCommande)}</span>
          </div>
          {o.dateLivraison && (
            <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
              <CalendarCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span className="text-xs">Livraison prévue : {formatDate(o.dateLivraison)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          {nextStatus && nextLabel && (
            <Button
              size="sm"
              variant="outline"
              onClick={onAdvance}
              className="flex-1 gap-1.5 text-xs border-slate-300 hover:bg-slate-50"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {nextLabel}
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 text-slate-500 hover:text-slate-700"
            title="Modifier"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Shared dialog sub-component ──────────────────────────────────────────────

interface OrtheseDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description: string
  patients: Patient[]
  form: typeof EMPTY_FORM
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>
  onSubmit: () => void
  submitting: boolean
  submitLabel: string
}

function OrtheseDialog({
  open, onOpenChange, title, description,
  patients, form, setForm, onSubmit, submitting, submitLabel,
}: OrtheseDialogProps) {
  const set = (key: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Patient */}
          <div className="grid gap-1.5">
            <Label htmlFor="patientId">Patient <span className="text-red-500">*</span></Label>
            <Select
              value={form.patientId}
              onValueChange={(v) => setForm((f) => ({ ...f, patientId: v }))}
            >
              <SelectTrigger id="patientId">
                <SelectValue placeholder="Sélectionner un patient…" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.prenom} {p.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type de semelle */}
          <div className="grid gap-1.5">
            <Label htmlFor="type">Type de semelle <span className="text-red-500">*</span></Label>
            <Input
              id="type"
              placeholder="ex. Semelle thermoformée"
              value={form.type}
              onChange={set("type")}
            />
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Observations, spécifications techniques…"
              rows={3}
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prix */}
            <div className="grid gap-1.5">
              <Label htmlFor="prix">Prix (€) <span className="text-red-500">*</span></Label>
              <Input
                id="prix"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.prix}
                onChange={set("prix")}
              />
            </div>

            {/* Date de livraison prévue */}
            <div className="grid gap-1.5">
              <Label htmlFor="dateLivraison">Date de livraison prévue</Label>
              <Input
                id="dateLivraison"
                type="date"
                value={form.dateLivraison}
                onChange={set("dateLivraison")}
              />
            </div>
          </div>

          {/* Statut */}
          <div className="grid gap-1.5">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as Status }))}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commande">En commande</SelectItem>
                <SelectItem value="en_fabrication">En fabrication</SelectItem>
                <SelectItem value="livree">Livrée</SelectItem>
                <SelectItem value="facturee">Facturée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Annuler
          </Button>
          <Button onClick={onSubmit} disabled={submitting} className="bg-teal-600 hover:bg-teal-700">
            {submitting ? "Enregistrement…" : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
